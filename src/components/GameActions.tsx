import { useNavigate } from 'react-router-dom';
import { useSudoku } from '../context/SudokuContext';
import styles from './GameActions.module.css';

export default function GameActions() {
  const { restart } = useSudoku();
  const navigate = useNavigate();

  return (
    <div className={styles.actions}>
      <button className={styles.btnSecondary} onClick={restart}>
        Recommencer
      </button>
      <button className={styles.btnPrimary} onClick={() => navigate('/')}>
        Quitter
      </button>
    </div>
  );
}
