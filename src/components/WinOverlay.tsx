import { useEffect, useRef, useState } from 'react';
import { useSudoku } from '../context/SudokuContext';
import { saveScore, type SaveScoreResult } from '../utils/scoreManager';
import styles from './WinOverlay.module.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function WinOverlay() {
  const { gameStatus, timer, newGame, difficulty } = useSudoku();
  const [record, setRecord] = useState<SaveScoreResult | null>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    if (gameStatus === 'won' && !savedRef.current) {
      savedRef.current = true;
      setRecord(saveScore(difficulty, timer));
    }
    if (gameStatus !== 'won') {
      savedRef.current = false;
      setRecord(null);
    }
  }, [gameStatus, difficulty, timer]);

  if (gameStatus !== 'won') return null;

  const badge = record?.isNewAllTime
    ? { text: '🏆 Meilleur temps !', cls: styles.badgeAllTime }
    : record?.isNewWeekly
    ? { text: '🥇 Record de la semaine !', cls: styles.badgeWeekly }
    : null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Félicitations">
      <div className={styles.card}>
        <div className={styles.emoji}>🎉</div>
        <h2 className={styles.title}>Bravo !</h2>
        {badge && <div className={`${styles.badge} ${badge.cls}`}>{badge.text}</div>}
        <p className={styles.subtitle}>Puzzle résolu en</p>
        <p className={styles.time}>{formatTime(timer)}</p>
        <button className={styles.btn} onClick={() => newGame(difficulty)}>
          Nouvelle partie
        </button>
      </div>
    </div>
  );
}
