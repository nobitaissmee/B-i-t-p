import Checker from "./checker.js";

const restartDOM = document.getElementById("restart");
const boardDOM = document.getElementById("board");

class Game {
  constructor() {
    this.board = [];
    this.resetBoard();

    this.isWin = false;
    this.turn = 0;
    this.checker = new Checker();

    this.clickHandler = this.clickHandler.bind(this);
    boardDOM.addEventListener("click", this.clickHandler);

    this.restart = this.restart.bind(this);
    restartDOM.addEventListener("click", this.restart);

    this.render();
  }

  resetBoard() {
    this.board = [];
    for (let i = 0; i < 20; i++) {
      const row = new Array(20);
      row.fill(0, 0, 20);
      this.board.push(row);
    }
  }

  render() {
    let buffer = "";

    for (let i = 0; i < 20; i++) {
      buffer += "<div class='row'>";
      for (let j = 0; j < 20; j++) {
        const thisCellClass =
          this.board[i][j] === 1
            ? "cell node"
            : this.board[i][j] === 2
            ? "cell cross"
            : "cell ";

        buffer += `<div id="${i}_${j}" class="${thisCellClass}"></div>`;
      }
      buffer += "</div>";
    }

    boardDOM.innerHTML = buffer;
  }

  restart() {
    if (confirm("Restart game?")) {
      this.resetBoard();
      this.isWin = false;
      this.turn = 0;

      document.querySelectorAll(".cell").forEach(({ classList }) => {
        classList.remove("node");
        classList.remove("cross");
      });
    }
  }

  winHandler() {
    if (this.checker.isWin(this.board)) {
      alert(`${this.turn % 2 === 0 ? "X" : "O"} win!`);

      this.restart();
    }
  }

  clickHandler({ target }) {
    if (!target.classList.contains("cell")) return;

    const positionArr = target.id.split("_");

    const dX = parseInt(positionArr[0]);
    const dY = parseInt(positionArr[1]);

    if (this.board[dX][dY] === 0) {
      let thisClass;
      let thisNum;

      if (this.turn % 2 === 0) {
        thisClass = "node";
        thisNum = 1;
      } else {
        thisClass = "cross";
        thisNum = 2;
      }

      target.classList.add(thisClass);
      this.board[dX][dY] = thisNum;
      this.turn++;

      this.winHandler();
    }
  }
}

let game = new Game();
