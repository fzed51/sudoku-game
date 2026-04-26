import { useSudoku } from '../context/SudokuContext';
import styles from './SudokuCell.module.css';

interface Props {
  row: number;
  col: number;
}

export default function SudokuCell({ row, col }: Props) {
  const { board, given, selected, notes, conflicts, solution, gameStatus, selectCell } = useSudoku();
  const value = board[row][col];
  const isGiven = given[row][col];
  const isSelected = selected?.row === row && selected?.col === col;
  const isConflict = conflicts.has(`${row}-${col}`);
  const isCorrect = gameStatus === 'won' || (value !== null && value === solution[row][col]);

  // Highlight : même ligne, colonne, ou bloc que la cellule sélectionnée
  let isHighlighted = false;
  if (selected && !isSelected) {
    const sameRow = selected.row === row;
    const sameCol = selected.col === col;
    const sameBlock =
      Math.floor(selected.row / 3) === Math.floor(row / 3) &&
      Math.floor(selected.col / 3) === Math.floor(col / 3);
    isHighlighted = sameRow || sameCol || sameBlock;
  }

  // Highlight chiffre identique
  const selectedValue = selected ? board[selected.row][selected.col] : null;
  const isSameNumber = value !== null && selectedValue !== null && value === selectedValue && !isSelected;

  const cellNotes = notes[row][col];
  const hasNotes = cellNotes.size > 0 && value === null;

  // Note en gras si elle correspond au chiffre de la cellule sélectionnée
  const highlightedNote = selectedValue;

  const cls = [
    styles.cell,
    isGiven ? styles.given : '',
    isSelected ? styles.selected : '',
    isHighlighted ? styles.highlighted : '',
    isSameNumber ? styles.sameNumber : '',
    isConflict ? styles.conflict : '',
    isCorrect && !isGiven && value !== null ? styles.correct : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <td className={cls} onClick={() => selectCell(row, col)}>
      {hasNotes ? (
        <div className={styles.notes}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span
              key={n}
              className={`${styles.note} ${cellNotes.has(n) && n === highlightedNote ? styles.noteHighlighted : ''}`}
            >
              {cellNotes.has(n) ? n : ''}
            </span>
          ))}
        </div>
      ) : (
        <span className={styles.value}>{value ?? ''}</span>
      )}
    </td>
  );
}
