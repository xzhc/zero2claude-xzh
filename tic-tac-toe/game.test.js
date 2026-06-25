const { describe, it } = require('node:test');
const assert = require('node:assert');
const TicTacToeGame = require('./game.js');

describe('TicTacToeGame', () => {
  it('X always goes first', () => {
    const game = new TicTacToeGame();
    const result = game.makeMove(0, 'X');
    assert.strictEqual(result.symbol, 'X');
    assert.strictEqual(game.getState().turn, 'O');
  });

  it('placing a move on an occupied cell returns valid:false', () => {
    const game = new TicTacToeGame();
    game.makeMove(0, 'X');
    const result = game.makeMove(0, 'O');
    assert.strictEqual(result.valid, false);
  });

  it('playing out of turn returns valid:false', () => {
    const game = new TicTacToeGame();
    game.makeMove(0, 'X'); // turn is now O
    const result = game.makeMove(4, 'X'); // X tries to play again
    assert.strictEqual(result.valid, false);
  });

  it('after win, no more moves are allowed', () => {
    const game = new TicTacToeGame();
    game.makeMove(0, 'X');
    game.makeMove(3, 'O');
    game.makeMove(1, 'X');
    game.makeMove(4, 'O');
    const winResult = game.makeMove(2, 'X'); // X wins top row
    assert.strictEqual(winResult.winner, 'X');
    const extra = game.makeMove(8, 'O');
    assert.strictEqual(extra.valid, false);
  });

  it('a full board with no winner reports a draw', () => {
    const game = new TicTacToeGame();
    game.makeMove(0, 'X');
    game.makeMove(8, 'O');
    game.makeMove(2, 'X');
    game.makeMove(6, 'O');
    game.makeMove(4, 'X');
    game.makeMove(1, 'O');
    game.makeMove(3, 'X');
    game.makeMove(5, 'O');
    const result = game.makeMove(7, 'X');
    assert.strictEqual(result.isDraw, true);
    assert.strictEqual(result.winner, null);
  });
});
