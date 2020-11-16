//setup canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const resultDOM = document.getElementById("result");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

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
    this.resetBall();
  }

  resetBall() {
    this.cX = 240;
    this.cY = 300;
    this.speedX = 1.2;
    this.speedY = -2;
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

  // hit(bar) {
  //   const left = this.cX - this.radius;
  //   const right = this.cX + this.radius;
  //   const top = this.cY - this.radius;
  //   const bottom = this.cY + this.radius;

  //   if (left <= 0 || right >= CANVAS_WIDTH) {
  //     this.speedX = -this.speedX;
  //   }

  //   if (top <= 0) {
  //     this.speedY = -this.speedY;
  //   }

  //   if (bottom >= bar.cY && right >= bar.cX && left <= bar.cX + bar.width) {
  //     this.point++;
  //     this.speedY = -this.speedY;
  //   }

  //   if (bottom >= CANVAS_HEIGHT) {
  //     window.confirm(`Do you want reset this game?`);

  //   }
  // }

  // pointHitBar() {
  //   document.getElementById("result").innerHTML = `Point:${this.point}`;
  // }
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

class GameController {
  constructor(ball, bar) {
    this.setBall(ball);
    this.setBar(bar);
    this.resetPoint();
    this.isPlaying = true;
  }

  resetPoint() {
    this.point = 0;
  }

  setBall(ball) {
    this.ball = ball;
  }

  setBar(bar) {
    this.bar = bar;
  }

  hit() {
    const left = this.ball.cX - this.ball.radius;
    const right = this.ball.cX + this.ball.radius;
    const top = this.ball.cY - this.ball.radius;
    const bottom = this.ball.cY + this.ball.radius;

    this.hitBar(bottom, left, right);
    this.hitWall(top, bottom, left, right);
  }

  hitBar(bottom, left, right) {
    if (
      bottom >= this.bar.cY &&
      right >= this.bar.cX &&
      left <= this.bar.cX + this.bar.width
    ) {
      this.point++;
      this.ball.speedY = -this.ball.speedY;
    }
  }

  hitWall(top, bottom, left, right) {
    if (left <= 0 || right >= CANVAS_WIDTH) {
      this.ball.speedX = -this.ball.speedX;
    }

    if (top <= 0) {
      this.ball.speedY = -this.ball.speedY;
    }

    if (bottom >= CANVAS_HEIGHT) {
      this.isPlaying = false;
      if (confirm(`Do you want reset this game?`)) {
        this.resetPoint();
        this.ball.resetBall();
        this.isPlaying = true;
      }
    }
  }

  pointHitBar() {
    resultDOM.innerHTML = `Point:${this.point}`;
  }
}

const gameBoard = new GameBoard();
const ball = new Ball();
const bar = new Bar();
const controller = new GameController(ball, bar);

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
  console.log("run");

  ball.update();
  bar.update();

  gameBoard.draw(ctx);
  ball.draw(ctx);
  bar.draw(ctx);

  controller.hit();
  controller.pointHitBar();
  if (!controller.isPlaying) return;
  requestAnimationFrame(gameLoop);
}

gameLoop();
