const socket = io();

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let playerSymbol = null;
let currentTurn = null;
let gameActive = false;
let roomId = null;

const findGameBtn = document.getElementById('find-game');
const statusEl = document.getElementById('status');
const boardEl = document.getElementById('board');
const cells = boardEl.querySelectorAll('.cell');
const playAgainBtn = document.getElementById('play-again');

function setBoardEnabled(enabled) {
  cells.forEach(cell => cell.disabled = !enabled);
}

function resetBoard() {
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'placed');
  });
  gameActive = false;
  roomId = null;
  currentTurn = null;
  playAgainBtn.hidden = true;
  findGameBtn.hidden = false;
}

function getWinningCells(board, winner) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] === winner && board[b] === winner && board[c] === winner) {
      return line;
    }
  }
  return null;
}

function highlightCells(indices) {
  indices.forEach(i => {
    cells[i].style.background = 'rgba(255, 255, 255, 0.1)';
  });
}

findGameBtn.addEventListener('click', () => {
  socket.emit('find-game');
  statusEl.textContent = 'Searching for opponent...';
  findGameBtn.hidden = true;
});

playAgainBtn.addEventListener('click', () => {
  resetBoard();
  statusEl.textContent = 'Click Find Game to start';
  socket.emit('find-game');
  statusEl.textContent = 'Searching for opponent...';
});

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = parseInt(cell.dataset.index, 10);

    if (!gameActive || !playerSymbol) return;
    if (currentTurn !== playerSymbol) return;
    if (cell.textContent !== '') return;

    socket.emit('make-move', { index, roomId });
  });
});

socket.on('waiting', () => {
  statusEl.textContent = 'Waiting for another player...';
});

socket.on('game-start', ({ symbol, roomId: id }) => {
  playerSymbol = symbol;
  roomId = id;
  gameActive = true;
  currentTurn = 'X';

  statusEl.textContent = `You are ${symbol}. Your opponent is ${symbol === 'X' ? 'O' : 'X'}.`;
  setBoardEnabled(true);
});

socket.on('move-made', ({ symbol, board, turn }) => {
  currentTurn = turn;

  for (let i = 0; i < 9; i++) {
    if (board[i] && !cells[i].textContent) {
      cells[i].textContent = board[i];
      cells[i].classList.add(board[i].toLowerCase(), 'placed');
      cells[i].disabled = true;
    }
  }

  const turnSymbol = turn === playerSymbol ? 'Your turn' : "Opponent's turn";
  statusEl.textContent = `${turnSymbol} (${turn})`;

  setBoardEnabled(turn === playerSymbol);
});

socket.on('game-over', ({ winner, isDraw, board }) => {
  gameActive = false;
  setBoardEnabled(false);

  if (isDraw) {
    statusEl.textContent = "It's a draw!";
  } else if (winner === playerSymbol) {
    statusEl.textContent = 'You win!';
  } else {
    statusEl.textContent = 'You lose!';
  }

  const winningCells = getWinningCells(board, winner);
  if (winningCells) {
    highlightCells(winningCells);
  }

  playAgainBtn.hidden = false;
});

socket.on('opponent-left', () => {
  gameActive = false;
  setBoardEnabled(false);
  statusEl.textContent = 'Opponent disconnected';
  playAgainBtn.hidden = false;
});
