import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import { type Board, findConflicts, deepCopyBoard } from '../utils/sudokuSolver';
import { type Difficulty, generatePuzzle } from '../utils/sudokuGenerator';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Notes = Set<number>[][];
export type GameStatus = 'idle' | 'playing' | 'won';

export interface SudokuState {
  board: Board;
  solution: number[][];
  given: boolean[][];
  selected: { row: number; col: number } | null;
  notes: Notes;
  history: { board: Board; notes: Notes }[];
  hintsLeft: number;
  notesMode: boolean;
  timer: number;
  isPaused: boolean;
  gameStatus: GameStatus;
  conflicts: Set<string>;
  difficulty: Difficulty;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type Action =
  | { type: 'NEW_GAME'; difficulty: Difficulty }
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'INPUT_NUMBER'; num: number }
  | { type: 'ERASE' }
  | { type: 'UNDO' }
  | { type: 'USE_HINT' }
  | { type: 'TOGGLE_NOTES' }
  | { type: 'RESTART' }
  | { type: 'TICK' }
  | { type: 'TOGGLE_PAUSE' };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emptyNotes(): Notes {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>())
  );
}

function copyNotes(notes: Notes): Notes {
  return notes.map(row => row.map(cell => new Set(cell)));
}

function checkWin(board: Board, solution: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

function buildGiven(board: Board): boolean[][] {
  return board.map(row => row.map(cell => cell !== null));
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

function createInitialState(difficulty: Difficulty = 'medium'): SudokuState {
  const { board, solution } = generatePuzzle(difficulty);
  return {
    board,
    solution,
    given: buildGiven(board),
    selected: null,
    notes: emptyNotes(),
    history: [],
    hintsLeft: 3,
    notesMode: false,
    timer: 0,
    isPaused: false,
    gameStatus: 'playing',
    conflicts: new Set(),
    difficulty,
  };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function sudokuReducer(state: SudokuState, action: Action): SudokuState {
  switch (action.type) {
    case 'NEW_GAME':
      return createInitialState(action.difficulty);

    case 'RESTART': {
      const freshBoard: Board = state.given.map((row, r) =>
        row.map((isGiven, c) => (isGiven ? state.solution[r][c] : null))
      );
      // Reconstruct given board from solution + given mask
      const givenBoard: Board = state.board.map((row, r) =>
        row.map((_, c) => (state.given[r][c] ? state.solution[r][c] : null))
      );
      return {
        ...state,
        board: givenBoard,
        notes: emptyNotes(),
        history: [],
        conflicts: new Set(),
        timer: 0,
        isPaused: false,
        gameStatus: 'playing',
        selected: null,
        freshBoard,
      } as unknown as SudokuState;
    }

    case 'SELECT_CELL':
      if (state.gameStatus !== 'playing' || state.isPaused) return state;
      return { ...state, selected: { row: action.row, col: action.col } };

    case 'INPUT_NUMBER': {
      const { selected, given, board, notes, notesMode, gameStatus, isPaused, solution } = state;
      if (!selected || gameStatus !== 'playing' || isPaused) return state;
      const { row, col } = selected;
      if (given[row][col]) return state;

      // Snapshot pour undo
      const snapshot = { board: deepCopyBoard(board), notes: copyNotes(notes) };

      if (notesMode) {
        const newNotes = copyNotes(notes);
        if (newNotes[row][col].has(action.num)) {
          newNotes[row][col].delete(action.num);
        } else {
          newNotes[row][col].add(action.num);
        }
        return {
          ...state,
          notes: newNotes,
          history: [...state.history, snapshot],
        };
      }

      const newBoard = deepCopyBoard(board);
      newBoard[row][col] = action.num;

      // Vider les notes de la cellule + même ligne/col/bloc
      const newNotes = copyNotes(notes);
      newNotes[row][col] = new Set();
      // Supprimer ce chiffre des notes de la même ligne, colonne, bloc
      for (let i = 0; i < 9; i++) {
        newNotes[row][i].delete(action.num);
        newNotes[i][col].delete(action.num);
      }
      const sr = Math.floor(row / 3) * 3;
      const sc = Math.floor(col / 3) * 3;
      for (let r = sr; r < sr + 3; r++) {
        for (let c = sc; c < sc + 3; c++) {
          newNotes[r][c].delete(action.num);
        }
      }

      const conflicts = findConflicts(newBoard);
      const won = conflicts.size === 0 && checkWin(newBoard, solution);

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        conflicts,
        gameStatus: won ? 'won' : 'playing',
        history: [...state.history, snapshot],
      };
    }

    case 'ERASE': {
      const { selected, given, board, notes, gameStatus, isPaused } = state;
      if (!selected || gameStatus !== 'playing' || isPaused) return state;
      const { row, col } = selected;
      if (given[row][col]) return state;
      if (board[row][col] === null && notes[row][col].size === 0) return state;

      const snapshot = { board: deepCopyBoard(board), notes: copyNotes(notes) };
      const newBoard = deepCopyBoard(board);
      newBoard[row][col] = null;
      const newNotes = copyNotes(notes);
      newNotes[row][col] = new Set();
      const conflicts = findConflicts(newBoard);

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        conflicts,
        history: [...state.history, snapshot],
      };
    }

    case 'UNDO': {
      if (state.history.length === 0) return state;
      const history = [...state.history];
      const last = history.pop()!;
      return {
        ...state,
        board: last.board,
        notes: last.notes,
        conflicts: findConflicts(last.board),
        history,
      };
    }

    case 'USE_HINT': {
      const { selected, given, board, solution, hintsLeft, gameStatus, isPaused } = state;
      if (hintsLeft <= 0 || gameStatus !== 'playing' || isPaused) return state;

      let targetRow = selected?.row ?? -1;
      let targetCol = selected?.col ?? -1;

      // Si pas de sélection ou cellule déjà remplie → cherche la première vide
      if (targetRow === -1 || board[targetRow][targetCol] !== null) {
        outer: for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (board[r][c] === null && !given[r][c]) {
              targetRow = r;
              targetCol = c;
              break outer;
            }
          }
        }
      }

      if (targetRow === -1) return state;

      const snapshot = { board: deepCopyBoard(board), notes: copyNotes(state.notes) };
      const newBoard = deepCopyBoard(board);
      newBoard[targetRow][targetCol] = solution[targetRow][targetCol];

      const newGiven = state.given.map(row => [...row]);
      newGiven[targetRow][targetCol] = true;

      const conflicts = findConflicts(newBoard);
      const won = conflicts.size === 0 && checkWin(newBoard, solution);

      return {
        ...state,
        board: newBoard,
        given: newGiven,
        hintsLeft: hintsLeft - 1,
        selected: { row: targetRow, col: targetCol },
        conflicts,
        gameStatus: won ? 'won' : 'playing',
        history: [...state.history, snapshot],
      };
    }

    case 'TOGGLE_NOTES':
      return { ...state, notesMode: !state.notesMode };

    case 'TICK':
      if (state.isPaused || state.gameStatus !== 'playing') return state;
      return { ...state, timer: state.timer + 1 };

    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface SudokuContextValue extends SudokuState {
  newGame: (difficulty?: Difficulty) => void;
  selectCell: (row: number, col: number) => void;
  inputNumber: (num: number) => void;
  erase: () => void;
  undo: () => void;
  useHint: () => void;
  toggleNotes: () => void;
  restart: () => void;
  togglePause: () => void;
}

const SudokuContext = createContext<SudokuContextValue | null>(null);

export function SudokuProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(sudokuReducer, undefined, () =>
    createInitialState('medium')
  );

  // Timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const newGame = useCallback((difficulty: Difficulty = 'medium') => {
    dispatch({ type: 'NEW_GAME', difficulty });
  }, []);
  const selectCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', row, col });
  }, []);
  const inputNumber = useCallback((num: number) => {
    dispatch({ type: 'INPUT_NUMBER', num });
  }, []);
  const erase = useCallback(() => dispatch({ type: 'ERASE' }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const useHint = useCallback(() => dispatch({ type: 'USE_HINT' }), []);
  const toggleNotes = useCallback(() => dispatch({ type: 'TOGGLE_NOTES' }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);
  const togglePause = useCallback(() => dispatch({ type: 'TOGGLE_PAUSE' }), []);

  return (
    <SudokuContext.Provider
      value={{
        ...state,
        newGame,
        selectCell,
        inputNumber,
        erase,
        undo,
        useHint,
        toggleNotes,
        restart,
        togglePause,
      }}
    >
      {children}
    </SudokuContext.Provider>
  );
}

export function useSudoku(): SudokuContextValue {
  const ctx = useContext(SudokuContext);
  if (!ctx) throw new Error('useSudoku must be used inside SudokuProvider');
  return ctx;
}
