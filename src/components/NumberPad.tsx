import { useSudoku } from '../context/SudokuContext';
import styles from './NumberPad.module.css';

export default function NumberPad() {
  const { inputNumber, gameStatus, isPaused, board } = useSudoku();
  const globalDisabled = gameStatus !== 'playing' || isPaused;

  // Compte les occurrences de chaque chiffre sur la grille
  const counts: Record<number, number> = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 };
  for (const row of board) {
    for (const cell of row) {
      if (cell !== null) counts[cell]++;
    }
  }

  return (
    <div className={styles.pad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
        const completed = counts[n] === 9;
        return (
          <button
            key={n}
            className={`${styles.btn} ${completed ? styles.completed : ''}`}
            onClick={() => inputNumber(n)}
            disabled={globalDisabled || completed}
            aria-label={`Chiffre ${n}`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
