import { useSudoku } from '../context/SudokuContext';
import SudokuCell from './SudokuCell';
import styles from './SudokuBoard.module.css';

export default function SudokuBoard() {
  const { errorCount } = useSudoku();
  return (
    <div className={styles.wrapper}>
      <div className={styles.errorBar}>
        <span>Erreurs :</span>
        <span className={styles.errorCount}>{errorCount}</span>
      </div>
      <div className={styles.board}>
        {Array.from({ length: 9 }, (_, row) =>
          Array.from({ length: 9 }, (_, col) => (
            <SudokuCell key={`${row}-${col}`} row={row} col={col} />
          ))
        )}
      </div>
    </div>
  );
}
