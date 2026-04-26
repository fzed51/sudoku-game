import { useSudoku } from '../context/SudokuContext';
import styles from './WinOverlay.module.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function WinOverlay() {
  const { gameStatus, timer, newGame, difficulty } = useSudoku();
  if (gameStatus !== 'won') return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Félicitations">
      <div className={styles.card}>
        <div className={styles.emoji}>🎉</div>
        <h2 className={styles.title}>Bravo !</h2>
        <p className={styles.subtitle}>Puzzle résolu en</p>
        <p className={styles.time}>{formatTime(timer)}</p>
        <button className={styles.btn} onClick={() => newGame(difficulty)}>
          Nouvelle partie
        </button>
      </div>
    </div>
  );
}
