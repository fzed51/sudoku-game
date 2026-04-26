import { type Board, isValid, countSolutions, deepCopyBoard } from './sudokuSolver';

export type Difficulty = 'easy' | 'medium' | 'hard';

const CELLS_TO_REMOVE: Record<Difficulty, number> = {
  easy: 30,
  medium: 43,
  hard: 52,
};

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Génère une grille complète valide aléatoire par backtracking randomisé.
 */
function generateFullBoard(): number[][] {
  const board: Board = Array.from({ length: 9 }, () => Array(9).fill(null));

  function fill(pos: number): boolean {
    if (pos === 81) return true;
    const row = Math.floor(pos / 9);
    const col = pos % 9;

    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const num of nums) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        if (fill(pos + 1)) return true;
        board[row][col] = null;
      }
    }
    return false;
  }

  fill(0);
  return board as number[][];
}

export interface Puzzle {
  board: Board;       // grille jouée (null = cellule vide)
  solution: number[][]; // solution complète
}

/**
 * Génère un puzzle avec solution unique pour la difficulté donnée.
 */
export function generatePuzzle(difficulty: Difficulty = 'medium'): Puzzle {
  const solution = generateFullBoard();
  const puzzle: Board = solution.map(row => [...row]);

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => i)
  );

  let removed = 0;
  const toRemove = CELLS_TO_REMOVE[difficulty];

  for (const pos of positions) {
    if (removed >= toRemove) break;

    const row = Math.floor(pos / 9);
    const col = pos % 9;
    const backup = puzzle[row][col];

    puzzle[row][col] = null;

    const copy = deepCopyBoard(puzzle);
    if (countSolutions(copy, 2) === 1) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return { board: puzzle, solution };
}
