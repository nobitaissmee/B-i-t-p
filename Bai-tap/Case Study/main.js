//setup canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width + 10;
const CANVAS_HEIGHT = canvas.height;

const width = (canvas.width = window.innerWidth);
const height = (canvas.width = window.innerHeight);

let currentKeyCode = undefined;

//setup GameBoard

class GameBoard {
  constructor() {
    this.width = CANVAS_WIDTH;
    this.height = CANVAS_HEIGHT;
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.strokeRect(0, 0, this.width, this.height);
  }
}

//setup Ball

class Ball {
  constructor() {
    this.radius = 15;
    this.speedX = 1.2;
    this.speedY = -2;
    this.cX = 240;
    this.cY = 300;
    this.point = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(this.cX, this.cY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    this.cX += this.speedX;
    this.cY += this.speedY;
  }

  hit(bar) {
    const left = this.cX - this.radius;
    const right = this.cX + this.radius;
    const top = this.cY - this.radius;
    const bottom = this.cY + this.radius;

    if (left <= 0 || right >= CANVAS_WIDTH) {
      this.speedX = -this.speedX;
    }

    if (top <= 0) {
      this.speedY = -this.speedY;
    }

    if (bottom >= bar.cY && right >= bar.cX && left <= bar.cX + bar.width) {
      this.point++;
      this.speedY = -this.speedY;
    }
    if (bottom >= CANVAS_HEIGHT) {
      alert(`Game over`);
      return;
    }
  }
}

//setup Bar
const BAR_STATE = {
  IDLE: 1,
  MOVE_LEFT: 2,
  MOVE_RIGHT: 3,
};

class Bar {
  constructor() {
    this.width = 100;
    this.height = 10;
    this.speed = 5;
    this.cX = 250;
    this.cY = 400;
    this.state = BAR_STATE.IDLE;
  }

  draw(ctx) {
    ctx.fillRect(this.cX, this.cY, this.width, this.height);
  }

  moveLeft() {
    if (bar.cX > 0) bar.cX -= bar.speed;
  }

  moveRight() {
    if (bar.cX + bar.width < CANVAS_WIDTH) bar.cX += bar.speed;
  }

  update() {
    switch (this.state) {
      case BAR_STATE.IDLE:
        return;
      case BAR_STATE.MOVE_LEFT:
        this.moveLeft();
        break;
      case BAR_STATE.MOVE_RIGHT:
        this.moveRight();
    }
  }
}

const gameBoard = new GameBoard();
const ball = new Ball();
const bar = new Bar();

// function doKeyDown(e) {
//   if (e.keyCode == 37) {
//     if (bar.cX - bar.width > 0) {
//       bar.cX -= bar.speed;
//     }
//   } else if (e.keyCode == 39) {
//     if (bar.cX + bar.width < CANVAS_WIDTH) {
//       bar.cX += bar.speed;
//     }
//   }
// }

function isValidKey(e) {
  if (e.repeat) return false;
  return e.keyCode === 37 || e.keyCode === 39;
}

function handleKeyDown(e) {
  if (!isValidKey(e)) return;
  currentKeyCode = e.keyCode;
  bar.state = e.keyCode === 37 ? BAR_STATE.MOVE_LEFT : BAR_STATE.MOVE_RIGHT;
}

function handleKeyUp(e) {
  if (!isValidKey(e)) return;
  if (currentKeyCode === e.keyCode) {
    currentKeyCode = undefined;
    bar.state = BAR_STATE.IDLE;
  }
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

function gameLoop() {
  ball.update();
  bar.update();
  ball.hit(bar);
  gameBoard.draw(ctx);
  ball.draw(ctx);
  bar.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();
