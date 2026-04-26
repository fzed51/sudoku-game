import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSudoku } from '../context/SudokuContext';
import { type Difficulty } from '../utils/sudokuGenerator';
import { getBestScores, type BestScores } from '../utils/scoreManager';
import styles from './HomePage.module.css';

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Facile' },
  { value: 'medium', label: 'Moyen' },
  { value: 'hard', label: 'Difficile' },
];

const STORAGE_KEY = 'sudoku-difficulty';

function getSavedDifficulty(): Difficulty {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'easy' || saved === 'medium' || saved === 'hard') return saved;
  return 'medium';
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { newGame } = useSudoku();
  const [difficulty, setDifficulty] = useState<Difficulty>(getSavedDifficulty);
  const [scores, setScores] = useState<BestScores>(() => getBestScores(getSavedDifficulty()));

  useEffect(() => {
    setScores(getBestScores(difficulty));
  }, [difficulty]);

  function handleDifficulty(d: Difficulty) {
    setDifficulty(d);
    localStorage.setItem(STORAGE_KEY, d);
  }

  function handleStart() {
    newGame(difficulty);
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
        <div className={styles.difficulty} role="group" aria-label="Difficulté">
          {DIFFICULTIES.map(({ value, label }) => (
            <button
              key={value}
              className={`${styles.diffBtn} ${difficulty === value ? styles.diffBtnActive : ''}`}
              onClick={() => handleDifficulty(value)}
              aria-pressed={difficulty === value}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.scores}>
          <div className={styles.scoreRow}>
            <span className={styles.scoreLabel}>Meilleur</span>
            <span className={styles.scoreValue}>{scores.allTime !== null ? formatTime(scores.allTime) : '–'}</span>
          </div>
          <div className={styles.scoreRow}>
            <span className={styles.scoreLabel}>Cette semaine</span>
            <span className={styles.scoreValue}>{scores.weekly !== null ? formatTime(scores.weekly) : '–'}</span>
          </div>
        </div>
        <button className={styles.startBtn} onClick={handleStart}>
          Démarrer une partie
        </button>
      </div>
    </main>
  );
}
