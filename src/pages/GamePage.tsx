import SudokuBoard from '../components/SudokuBoard';
import ToolBar from '../components/ToolBar';
import NumberPad from '../components/NumberPad';
import GameActions from '../components/GameActions';
import Timer from '../components/Timer';
import WinOverlay from '../components/WinOverlay';
import { useSudoku } from '../context/SudokuContext';
import styles from './GamePage.module.css';

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

export default function GamePage() {
  const { isPaused, gameStatus, difficulty } = useSudoku();

  return (
    <main className={styles.page}>
      {/* ────── PORTRAIT ────── */}
      <div className={styles.portrait}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Sudoku</h1>
            <span className={styles.difficultyBadge}>{DIFFICULTY_LABELS[difficulty]}</span>
          </div>
          <Timer />
        </header>

        <div className={`${styles.boardWrapper} ${isPaused ? styles.blurred : ''}`}>
          <SudokuBoard />
        </div>

        {isPaused && gameStatus === 'playing' && (
          <div className={styles.pauseMessage}>En pause</div>
        )}

        <ToolBar />
        <NumberPad />
        <GameActions />
      </div>

      {/* ────── PAYSAGE ────── */}
      <div className={styles.landscape}>
        <div className={`${styles.boardWrapper} ${isPaused ? styles.blurred : ''}`}>
          <SudokuBoard />
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sideHeader}>
            <div>
              <h1 className={styles.pageTitle}>Sudoku</h1>
              <span className={styles.difficultyBadge}>{DIFFICULTY_LABELS[difficulty]}</span>
            </div>
            <Timer />
          </div>
          <ToolBar />
          <NumberPad />
          <GameActions />
        </aside>
      </div>

      <WinOverlay />
    </main>
  );
}
