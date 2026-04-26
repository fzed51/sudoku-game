import { useSudoku } from '../context/SudokuContext';
import styles from './NumberPad.module.css';

export default function NumberPad() {
  const { inputNumber, gameStatus, isPaused } = useSudoku();
  const disabled = gameStatus !== 'playing' || isPaused;

  return (
    <div className={styles.pad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
        <button
          key={n}
          className={styles.btn}
          onClick={() => inputNumber(n)}
          disabled={disabled}
          aria-label={`Chiffre ${n}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
