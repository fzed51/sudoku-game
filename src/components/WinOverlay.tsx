import { useEffect, useRef, useState } from 'react';
import { useSudoku } from '../context/SudokuContext';
import { INITIAL_HINTS, ERROR_PENALTY_SECONDS, HINT_PENALTY_SECONDS } from '../context/SudokuContext';
import { saveScore, type SaveScoreResult } from '../utils/scoreManager';
import styles from './WinOverlay.module.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function WinOverlay() {
  const { gameStatus, timer, newGame, difficulty, errorCount, hintsLeft } = useSudoku();
  const [record, setRecord] = useState<SaveScoreResult | null>(null);
  const savedRef = useRef(false);

  const hintsUsed = INITIAL_HINTS - hintsLeft;
  const errorPenalty = errorCount * ERROR_PENALTY_SECONDS;
  const hintPenalty = hintsUsed * HINT_PENALTY_SECONDS;
  const totalTime = timer + errorPenalty + hintPenalty;

  useEffect(() => {
    if (gameStatus === 'won' && !savedRef.current) {
      savedRef.current = true;
      setRecord(saveScore(difficulty, totalTime));
    }
    if (gameStatus !== 'won') {
      savedRef.current = false;
      setRecord(null);
    }
  }, [gameStatus, difficulty, totalTime]);

  if (gameStatus !== 'won') return null;

  const badge = record?.isNewAllTime
    ? { text: '🏆 Meilleur temps !', cls: styles.badgeAllTime }
    : record?.isNewWeekly
    ? { text: '🥇 Record de la semaine !', cls: styles.badgeWeekly }
    : null;

  const hasPenalty = errorPenalty > 0 || hintPenalty > 0;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Félicitations">
      <div className={styles.card}>
        <div className={styles.emoji}>🎉</div>
        <h2 className={styles.title}>Bravo !</h2>
        {badge && <div className={`${styles.badge} ${badge.cls}`}>{badge.text}</div>}
        <p className={styles.subtitle}>Puzzle résolu</p>
        <div className={styles.timeBreakdown}>
          <div className={styles.timeRow}>
            <span>Chrono</span>
            <span className={styles.timeValue}>{formatTime(timer)}</span>
          </div>
          {errorPenalty > 0 && (
            <div className={`${styles.timeRow} ${styles.penaltyRow}`}>
              <span>{errorCount} erreur{errorCount > 1 ? 's' : ''} × {ERROR_PENALTY_SECONDS}s</span>
              <span className={styles.penaltyValue}>+{formatTime(errorPenalty)}</span>
            </div>
          )}
          {hintPenalty > 0 && (
            <div className={`${styles.timeRow} ${styles.penaltyRow}`}>
              <span>{hintsUsed} indice{hintsUsed > 1 ? 's' : ''} × {HINT_PENALTY_SECONDS}s</span>
              <span className={styles.penaltyValue}>+{formatTime(hintPenalty)}</span>
            </div>
          )}
          {hasPenalty && (
            <>
              <div className={styles.divider} />
              <div className={`${styles.timeRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span className={styles.totalValue}>{formatTime(totalTime)}</span>
              </div>
            </>
          )}
        </div>
        <button className={styles.btn} onClick={() => newGame(difficulty)}>
          Nouvelle partie
        </button>
      </div>
    </div>
  );
}
