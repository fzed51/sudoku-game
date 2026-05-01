import SudokuCell from './SudokuCell';
import styles from './SudokuBoard.module.css';

export default function SudokuBoard() {
  return (
    <div className={styles.wrapper}>
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
