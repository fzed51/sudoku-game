export type Board = (number | null)[][];

/**
 * Vérifie si placer `num` en [row][col] est valide.
 */
export function isValid(board: Board, row: number, col: number, num: number): boolean {
  // Ligne
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  // Colonne
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  // Bloc 3×3
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

/**
 * Résout la grille par backtracking.
 * Modifie `board` en place. Retourne true si une solution a été trouvée.
 */
export function solve(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Compte le nombre de solutions (s'arrête à 2 pour vérifier l'unicité).
 */
export function countSolutions(board: Board, limit = 2): number {
  let count = 0;

  function backtrack(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (backtrack()) return true;
              board[row][col] = null;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  backtrack();
  return count;
}

/**
 * Vérifie si la grille jouée contient des conflits.
 * Retourne un Set de clés "row-col" en conflit.
 */
export function findConflicts(board: Board): Set<string> {
  const conflicts = new Set<string>();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = board[row][col];
      if (val === null) continue;

      // Temporairement vider la cellule pour tester
      board[row][col] = null;
      if (!isValid(board, row, col, val)) {
        conflicts.add(`${row}-${col}`);
      }
      board[row][col] = val;
    }
  }

  return conflicts;
}

export function deepCopyBoard(board: Board): Board {
  return board.map(row => [...row]);
}
