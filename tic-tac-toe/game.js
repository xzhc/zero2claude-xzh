class TicTacToeGame {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
  }

  getState() {
    return {
      board: [...this.board],
      turn: this.currentPlayer,
    };
  }

  makeMove(cellIndex, player) {
    if (cellIndex < 0 || cellIndex > 8) {
      return { valid: false, symbol: null, winner: null, isDraw: false, board: [...this.board] };
    }
    if (this.board[cellIndex] !== null) {
      return { valid: false, symbol: null, winner: null, isDraw: false, board: [...this.board] };
    }
    if (this.currentPlayer !== 'X' && this.currentPlayer !== 'O') {
      return { valid: false, symbol: null, winner: null, isDraw: false, board: [...this.board] };
    }
    if (player !== undefined && player !== this.currentPlayer) {
      return { valid: false, symbol: null, winner: null, isDraw: false, board: [...this.board] };
    }

    const symbol = this.currentPlayer;
    this.board[cellIndex] = symbol;

    const winner = this.#checkWinner();
    const isDraw = !winner && this.board.every(cell => cell !== null);

    if (!winner && !isDraw) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    } else {
      this.currentPlayer = null;
    }

    return { valid: true, symbol, winner, isDraw, board: [...this.board] };
  }

  #checkWinner() {
    const lines = [
      [0, 1, 2], // Row 0 (top)
      [3, 4, 5], // Row 1 (middle)
      [6, 7, 8], // Row 2 (bottom)
      [0, 3, 6], // Column 0 (left)
      [1, 4, 7], // Column 1 (center)
      [2, 5, 8], // Column 2 (right)
      [0, 4, 8], // Diagonal: top-left to bottom-right
      [2, 4, 6], // Diagonal: top-right to bottom-left
    ];

    for (const [a, b, c] of lines) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a];
      }
    }
    return null;
  }
}

module.exports = TicTacToeGame;
