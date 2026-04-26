import { useSudoku } from '../context/SudokuContext';
import styles from './ToolBar.module.css';

export default function ToolBar() {
  const { undo, erase, toggleNotes, useHint, notesMode, hintsLeft, history, gameStatus, isPaused } = useSudoku();
  const disabled = gameStatus !== 'playing' || isPaused;

  return (
    <div className={styles.toolbar}>
      {/* Undo */}
      <button
        className={styles.btn}
        onClick={undo}
        disabled={disabled || history.length === 0}
        aria-label="Annuler"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 14L4 9l5-5" />
          <path d="M4 9h10a5 5 0 0 1 0 10h-1" />
        </svg>
        <span>Annuler</span>
      </button>

      {/* Gomme */}
      <button
        className={styles.btn}
        onClick={erase}
        disabled={disabled}
        aria-label="Effacer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" />
          <path d="M6.5 17.5l4-4" />
        </svg>
        <span>Effacer</span>
      </button>

      {/* Notes */}
      <button
        className={`${styles.btn} ${notesMode ? styles.active : ''}`}
        onClick={toggleNotes}
        disabled={disabled}
        aria-label="Mode notes"
        aria-pressed={notesMode}
      >
        <span className={styles.badge}>{notesMode ? 'ON' : 'OFF'}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        <span>Notes</span>
      </button>

      {/* Indice */}
      <button
        className={styles.btn}
        onClick={useHint}
        disabled={disabled || hintsLeft <= 0}
        aria-label={`Indice (${hintsLeft} restants)`}
      >
        <span className={styles.badge}>{hintsLeft}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Indice</span>
      </button>
    </div>
  );
}
