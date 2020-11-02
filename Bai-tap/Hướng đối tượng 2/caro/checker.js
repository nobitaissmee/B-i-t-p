export default class Checker {
  check5Cells(cells) {
    return (
      cells[0] !== 0 && cells.filter((cell) => cell !== cells[0]).length === 0
    );
  }

  isWin(board) {
    let cells;

    // check rows
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 16; y++) {
        cells = [];
        for (let i = 0; i < 5; i++) {
          cells.push(board[x][y + i]);
        }
        if (this.check5Cells(cells)) {
          return true;
        }
      }
    }

    // check cols
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 20; y++) {
        cells = [];
        for (let i = 0; i < 5; i++) {
          cells.push(board[x + i][y]);
        }
        if (this.check5Cells(cells)) {
          return true;
        }
      }
    }

    // check "\"" diagonal
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        cells = [];
        for (let i = 0; i < 5; i++) {
          cells.push(board[x + i][y + i]);
        }
        if (this.check5Cells(cells)) {
          return true;
        }
      }
    }

    // check "/" diagonal
    for (let x = 4; x < 20; x++) {
      for (let y = 0; y < 16; y++) {
        cells = [];
        for (let i = 0; i < 5; i++) {
          cells.push(board[x - i][y + i]);
        }
        if (this.check5Cells(cells)) {
          return true;
        }
      }
    }

    return false;
  }
}
