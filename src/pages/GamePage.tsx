import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
import SudokuBoard from '../components/SudokuBoard';
import ToolBar from '../components/ToolBar';
import NumberPad from '../components/NumberPad';
import GameActions from '../components/GameActions';
import Timer from '../components/Timer';
import WinOverlay from '../components/WinOverlay';
import { useSudoku } from '../context/SudokuContext';
import styles from './GamePage.module.css';

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

export default function GamePage() {
  const { isPaused, gameStatus, difficulty, selected, inputNumber, erase, selectCell, undo, history: undoHistory } = useSudoku();

  // Interception du bouton retour : annule la dernière action au lieu de naviguer
  const blocker = useBlocker(({ historyAction }) =>
    gameStatus === 'playing' && historyAction === 'POP'
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    if (undoHistory.length > 0) {
      undo();
      blocker.reset();
    } else {
      blocker.proceed();
    }
  }, [blocker, undoHistory.length, undo]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (gameStatus !== 'playing' || isPaused) return;

      // Chiffres 1-9 (rangée du haut et pavé numérique)
      const digitMatch = e.code.match(/^(?:Digit|Numpad)([1-9])$/);
      if (digitMatch) {
        e.preventDefault();
        inputNumber(parseInt(digitMatch[1], 10));
        return;
      }

      // Effacement
      if (e.code === 'Backspace' || e.code === 'Delete') {
        e.preventDefault();
        erase();
        return;
      }

      // Navigation par flèches
      const arrowMap: Record<string, [number, number]> = {
        ArrowUp: [-1, 0],
        ArrowDown: [1, 0],
        ArrowLeft: [0, -1],
        ArrowRight: [0, 1],
      };
      if (e.code in arrowMap) {
        e.preventDefault();
        const [dr, dc] = arrowMap[e.code];
        const row = selected ? Math.max(0, Math.min(8, selected.row + dr)) : 0;
        const col = selected ? Math.max(0, Math.min(8, selected.col + dc)) : 0;
        selectCell(row, col);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, isPaused, selected, inputNumber, erase, selectCell]);

  return (
    <main className={styles.page}>
      {/* ────── PORTRAIT ────── */}
      <div className={styles.portrait}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Sudoku</h1>
            <span className={styles.difficultyBadge}>{DIFFICULTY_LABELS[difficulty]}</span>
          </div>
          <Timer />
        </header>

        <div className={`${styles.boardWrapper} ${isPaused ? styles.blurred : ''}`}>
          <SudokuBoard />
        </div>

        {isPaused && gameStatus === 'playing' && (
          <div className={styles.pauseMessage}>En pause</div>
        )}

        <ToolBar />
        <NumberPad />
        <GameActions />
      </div>

      {/* ────── PAYSAGE ────── */}
      <div className={styles.landscape}>
        <div className={`${styles.boardWrapper} ${isPaused ? styles.blurred : ''}`}>
          <SudokuBoard />
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sideHeader}>
            <div>
              <h1 className={styles.pageTitle}>Sudoku</h1>
              <span className={styles.difficultyBadge}>{DIFFICULTY_LABELS[difficulty]}</span>
            </div>
            <Timer />
          </div>
          <ToolBar />
          <NumberPad />
          <GameActions />
        </aside>
      </div>

      <WinOverlay />
    </main>
  );
}
