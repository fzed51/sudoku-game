# Sudoku Game — Project Guidelines

## Project Overview
Jeu de Sudoku React 19 + TypeScript, mobile first, avec génération aléatoire de grilles et interface adaptative portrait/paysage.

## Tech Stack
- **React 19** with React Compiler (babel-plugin-react-compiler)
- **TypeScript ~6** — strict mode
- **react-router-dom v7** — BrowserRouter, `<Routes>` / `<Route>`
- **Vite 8** — bundler & dev server
- **CSS Modules** — scoped styles per component

## Architecture
```
src/
  context/    # SudokuContext.tsx — état global via useReducer + dispatch
  utils/      # sudokuSolver.ts (backtracking), sudokuGenerator.ts
  components/ # SudokuBoard, SudokuCell, NumberPad, ToolBar, Timer, GameActions, WinOverlay
  pages/      # HomePage, GamePage
  main.tsx    # BrowserRouter + SudokuProvider + Routes
```

## Commands
```bash
npm run dev     # Start dev server (Vite)
npm run build   # TypeScript check + Vite build
npm run lint    # ESLint
```

## Conventions

### State Management
- All game state lives in `SudokuContext` (useReducer pattern)
- Never mutate state directly — always `deepCopyBoard()` before modifications
- History stack stores snapshots `{ board, notes }` for undo

### CSS
- Use CSS Modules (`.module.css`) for all component styles
- CSS variables defined in `src/index.css` under `:root` with `--color-*` prefix
- Mobile-first: portrait layout by default, landscape via `@media (orientation: landscape) and (max-height: 600px)`

### TypeScript
- `Board = (number | null)[][]` — null means empty cell
- `given: boolean[][]` — cells provided at puzzle start (not editable by user)
- `Notes = Set<number>[][]` — notes per cell

### Sudoku Logic
- See `src/utils/` — never import solver/generator in components directly, go through context
- `generatePuzzle(difficulty)` returns `{ board, solution }`
- `findConflicts(board)` returns `Set<string>` of `"row-col"` keys

## Key Files
- `src/context/SudokuContext.tsx` — single source of truth, all actions dispatched here
- `src/utils/sudokuSolver.ts` — `solve()`, `countSolutions()`, `findConflicts()`, `isValid()`
- `src/utils/sudokuGenerator.ts` — `generatePuzzle(difficulty: 'easy'|'medium'|'hard')`
- `src/index.css` — CSS variables (colors, typography)

## Do NOT
- Add localStorage persistence (out of scope)
- Add dark mode (out of scope)
- Duplicate solver logic in components
- Use inline styles — always CSS Modules
