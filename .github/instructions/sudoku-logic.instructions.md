---
description: "Use when modifying sudoku algorithm files: solver, generator, or validation logic. Covers backtracking conventions, Board type usage, and performance constraints."
applyTo: "src/utils/**"
---
# Sudoku Logic Conventions

## Core Types
```ts
type Board = (number | null)[][];  // null = empty cell
```
Always use `deepCopyBoard(board)` before mutating — never modify the original board.

## Key Functions
| Function | File | Purpose |
|---|---|---|
| `isValid(board, row, col, num)` | sudokuSolver.ts | Check if placing num is legal |
| `solve(board)` | sudokuSolver.ts | Backtracking solver, modifies board in-place |
| `countSolutions(board, limit)` | sudokuSolver.ts | Count solutions (stop at limit=2 for uniqueness check) |
| `findConflicts(board)` | sudokuSolver.ts | Returns `Set<string>` of conflicting "row-col" keys |
| `generatePuzzle(difficulty)` | sudokuGenerator.ts | Returns `{ board, solution }` |

## Generator Algorithm
1. `generateFullBoard()` — randomized backtracking to create a complete valid grid
2. Remove cells one by one in random order
3. After each removal, call `countSolutions(copy, 2)` — only remove if solution remains unique (count === 1)
4. Stop when `CELLS_TO_REMOVE[difficulty]` cells have been removed

## Performance Notes
- `countSolutions` is called with `limit=2` — it short-circuits as soon as 2 solutions are found
- The generator can be slow on `hard` difficulty due to many uniqueness checks — acceptable since it runs once at game start
- Do NOT call `solve()` or `generatePuzzle()` inside React render — always call from context actions

## Conflict Detection
`findConflicts(board)` temporarily empties each non-null cell to test validity:
- Returns a `Set<"row-col">` — check with `conflicts.has(\`\${row}-\${col}\`)`
- Called after every `INPUT_NUMBER` and `ERASE` action in the reducer

## Adding a New Difficulty
Add to `CELLS_TO_REMOVE` in `sudokuGenerator.ts`:
```ts
const CELLS_TO_REMOVE: Record<Difficulty, number> = {
  easy: 36,
  medium: 46,
  hard: 52,
  // expert: 58,  ← add here
};
```
And extend the `Difficulty` type accordingly.
