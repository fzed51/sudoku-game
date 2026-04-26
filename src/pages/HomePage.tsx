import { useNavigate } from 'react-router-dom';
import { useSudoku } from '../context/SudokuContext';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { newGame } = useSudoku();

  function handleStart() {
    newGame('medium');
    navigate('/game');
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.logo} aria-hidden="true">
          <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Grille sudoku stylisée */}
            <rect x="4" y="4" width="82" height="82" rx="8" fill="var(--color-highlight)" stroke="var(--color-border-thick)" strokeWidth="2"/>
            {/* Lignes internes */}
            <line x1="31" y1="4" x2="31" y2="86" stroke="var(--color-border)" strokeWidth="1"/>
            <line x1="58" y1="4" x2="58" y2="86" stroke="var(--color-border)" strokeWidth="1"/>
            <line x1="4" y1="31" x2="86" y2="31" stroke="var(--color-border)" strokeWidth="1"/>
            <line x1="4" y1="58" x2="86" y2="58" stroke="var(--color-border)" strokeWidth="1"/>
            {/* Quelques chiffres */}
            <text x="14" y="26" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--color-given)">5</text>
            <text x="41" y="26" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--color-primary)">3</text>
            <text x="68" y="26" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--color-given)">9</text>
            <text x="14" y="53" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--color-given)">7</text>
            <text x="68" y="53" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--color-primary)">2</text>
            <text x="41" y="80" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--color-given)">8</text>
          </svg>
        </div>
        <h1 className={styles.title}>Sudoku</h1>
        <p className={styles.subtitle}>Entraîne ton cerveau !</p>
        <button className={styles.startBtn} onClick={handleStart}>
          Démarrer une partie
        </button>
      </div>
    </main>
  );
}
