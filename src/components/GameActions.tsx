import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSudoku } from '../context/SudokuContext';
import styles from './GameActions.module.css';

export default function GameActions() {
  const { restart } = useSudoku();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  function handleRestartClick() {
    setConfirming(true);
  }

  function handleConfirm() {
    setConfirming(false);
    restart();
  }

  function handleCancel() {
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div className={styles.actions}>
        <span className={styles.confirmLabel}>Recommencer ?</span>
        <button className={styles.btnDanger} onClick={handleConfirm}>
          Oui
        </button>
        <button className={styles.btnSecondary} onClick={handleCancel}>
          Non
        </button>
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      <button className={styles.btnSecondary} onClick={handleRestartClick}>
        Recommencer
      </button>
      <button className={styles.btnPrimary} onClick={() => navigate('/')}>
        Quitter
      </button>
    </div>
  );
}
