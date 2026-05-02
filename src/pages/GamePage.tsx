import { useEffect, useRef } from 'react';
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
  const { isPaused, gameStatus, difficulty, selected, inputNumber, erase, selectCell, undo, history: undoHistory, errorCount } = useSudoku();

  // Interception du bouton retour : annule la dernière action au lieu de naviguer
  const undoRef = useRef(undo);
  undoRef.current = undo;
  const undoHistoryRef = useRef(undoHistory);
  undoHistoryRef.current = undoHistory;

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    window.history.pushState(null, '');

    function handlePopState() {
      if (undoHistoryRef.current.length > 0) {
        undoRef.current();
        window.history.pushState(null, '');
      }
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [gameStatus]);

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
          <div className={styles.timerRow}>
            <div className={styles.errorInfo}>
              <span className={styles.errorLabel}>Erreurs</span>
              <span className={styles.errorCount}>{errorCount}</span>
            </div>
            <Timer />
          </div>
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
            <div className={styles.timerRow}>
              <div className={styles.errorInfo}>
                <span className={styles.errorLabel}>Erreurs</span>
                <span className={styles.errorCount}>{errorCount}</span>
              </div>
              <Timer />
            </div>
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
