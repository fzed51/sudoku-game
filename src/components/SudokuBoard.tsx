import SudokuCell from './SudokuCell';
import styles from './SudokuBoard.module.css';

export default function SudokuBoard() {
  return (
    <div className={styles.wrapper}>
      <table className={styles.board}>
        <tbody>
          {Array.from({ length: 9 }, (_, row) => (
            <tr key={row} className={row === 2 || row === 5 ? styles.blockBorderBottom : ''}>
              {Array.from({ length: 9 }, (_, col) => (
                <SudokuCell
                  key={col}
                  row={row}
                  col={col}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
