import { useSudoku } from '../context/SudokuContext';
import styles from './Timer.module.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Timer() {
  const { timer, isPaused, togglePause, gameStatus } = useSudoku();

  return (
    <div className={styles.timer}>
      <div className={styles.label}>Time</div>
      <div className={styles.time}>{formatTime(timer)}</div>
      {gameStatus === 'playing' && (
        <button
          className={styles.pauseBtn}
          onClick={togglePause}
          aria-label={isPaused ? 'Reprendre' : 'Pause'}
        >
          {isPaused ? (
            /* Play icon */
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          ) : (
            /* Pause icon */
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
