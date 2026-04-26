---
description: "Use when creating or modifying React components (.tsx files) in this project. Covers Context usage, hooks patterns, CSS Modules, and component structure conventions for the Sudoku game."
applyTo: "src/**/*.tsx"
---
# React Patterns — Sudoku Game

## Context Usage
Always consume game state via the `useSudoku()` hook:
```tsx
import { useSudoku } from '../context/SudokuContext';

function MyComponent() {
  const { board, selectCell, inputNumber } = useSudoku();
  // ...
}
```

Never import `SudokuContext` directly — always use the `useSudoku()` hook.

## CSS Modules
Every component has a co-located `.module.css` file:
```tsx
import styles from './MyComponent.module.css';

<div className={styles.wrapper}>
  <span className={`${styles.item} ${isActive ? styles.active : ''}`} />
</div>
```

Use template literals or array `.filter(Boolean).join(' ')` for conditional classes. Never use inline styles.

## Component Structure
- One component per file
- Props interface defined inline above the function
- Default export for the component

```tsx
interface Props {
  row: number;
  col: number;
}

export default function SudokuCell({ row, col }: Props) { ... }
```

## Event Handlers
Prefer direct dispatch via context actions rather than local state when the data is shared:
```tsx
// ✅ Good
const { selectCell } = useSudoku();
<td onClick={() => selectCell(row, col)} />

// ❌ Avoid
const [selected, setSelected] = useState(null); // duplicates context state
```

## Routing
Use `useNavigate()` from react-router-dom for navigation:
```tsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/game');
```

Routes are defined in `src/main.tsx` — do not add routes elsewhere.
