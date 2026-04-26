import { type Difficulty } from './sudokuGenerator';

const STORAGE_KEY = 'sudoku-scores';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

interface WeeklyEntry {
  time: number;
  ts: number;
}

interface DifficultyScores {
  allTime: number | null;
  weekly: WeeklyEntry[];
}

type ScoreStore = Record<Difficulty, DifficultyScores>;

function defaultStore(): ScoreStore {
  return {
    easy: { allTime: null, weekly: [] },
    medium: { allTime: null, weekly: [] },
    hard: { allTime: null, weekly: [] },
  };
}

function loadStore(): ScoreStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    const parsed = JSON.parse(raw) as Partial<ScoreStore>;
    const store = defaultStore();
    for (const d of ['easy', 'medium', 'hard'] as Difficulty[]) {
      const entry = parsed[d];
      if (entry) {
        store[d].allTime = typeof entry.allTime === 'number' ? entry.allTime : null;
        store[d].weekly = Array.isArray(entry.weekly) ? entry.weekly : [];
      }
    }
    return store;
  } catch {
    return defaultStore();
  }
}

function saveStore(store: ScoreStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function pruneWeekly(entries: WeeklyEntry[]): WeeklyEntry[] {
  const cutoff = Date.now() - WEEK_MS;
  return entries.filter(e => e.ts >= cutoff);
}

function weeklyBest(entries: WeeklyEntry[]): number | null {
  if (entries.length === 0) return null;
  return Math.min(...entries.map(e => e.time));
}

export interface SaveScoreResult {
  isNewAllTime: boolean;
  isNewWeekly: boolean;
}

export function saveScore(difficulty: Difficulty, time: number): SaveScoreResult {
  const store = loadStore();
  const entry = store[difficulty];

  entry.weekly = pruneWeekly(entry.weekly);

  const prevAllTime = entry.allTime;
  const prevWeekly = weeklyBest(entry.weekly);

  const isNewAllTime = prevAllTime === null || time < prevAllTime;
  const isNewWeekly = prevWeekly === null || time < prevWeekly;

  if (isNewAllTime) {
    entry.allTime = time;
  }

  entry.weekly.push({ time, ts: Date.now() });

  saveStore(store);

  return { isNewAllTime, isNewWeekly };
}

export interface BestScores {
  allTime: number | null;
  weekly: number | null;
}

export function getBestScores(difficulty: Difficulty): BestScores {
  const store = loadStore();
  const entry = store[difficulty];
  const pruned = pruneWeekly(entry.weekly);
  return {
    allTime: entry.allTime,
    weekly: weeklyBest(pruned),
  };
}
