//setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const ctd = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let keys = undefined;

//setup GameBoard

class GameBoard {
  constructor(barcom, baruser) {
    this.width = CANVAS_WIDTH;
    this.height = CANVAS_HEIGHT;
    this.setBarCom(barcom);
    this.setBarUser(baruser);
  }

  setBarCom(barcom) {
    this.barcom = barcom;
  }

  setBarUser(baruser) {
    this.baruser = baruser;
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.strokeRect(0, 0, this.width, this.height);
  }

  // drawText(ctd) {
  //   ctd.font = "15px fantasy";
  //   ctd.fillText(`Score Com:${this.barcom.point}`, 20, CANVAS_HEIGHT / 2 - 15);
  //   ctd.fillText(
  //     `Score User:${this.baruser.point}`,
  //     20,
  //     CANVAS_HEIGHT / 2 + 30
  //   );
  // }

  drawText(ctd) {
    ctd.font = "100px fantasy";
    ctd.fillText(`${this.barcom.point}`, CANVAS_WIDTH / 2 - 25, 150);
    ctd.fillText(`${this.baruser.point}`, CANVAS_WIDTH / 2 - 25, 400);
  }
}

// setup BarUser

const BAR_STATE = {
  IDLE: 1,
  MOVE_LEFT: 2,
  MOVE_RIGHT: 3,
};

class BarUser {
  constructor() {
    this.resetBarUser();
    this.width = 100;
    this.height = 10;
    this.point = 0;
    this.state = BAR_STATE.IDLE;
  }

  resetBarUser() {
    this.cX = CANVAS_WIDTH / 2 - 100 / 2;
    this.cY = CANVAS_HEIGHT - 10;
    this.speed = 3;
  }

  draw(ctx) {
    ctx.fillRect(this.cX, this.cY, this.width, this.height);
  }

  moveLeft() {
    if (this.cX > 0) {
      this.cX -= this.speed;
    }
  }

  moveRight() {
    if (this.cX + this.width < CANVAS_WIDTH) {
      this.cX += this.speed;
    }
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

//setup Com

class BarCom {
  constructor(ball) {
    this.setBall(ball);
    this.resetBarCom();
    this.width = 100;
    this.height = 10;
    this.point = 0;
  }

  setBall(ball) {
    this.ball = ball;
  }

  resetBarCom() {
    this.cX = CANVAS_WIDTH / 2 - 100 / 2;
    this.cY = 0;
  }

  draw(ctx) {
    ctx.fillRect(this.cX, this.cY, this.width, this.height);
  }

  update() {
    if (this.cX + this.width <= CANVAS_WIDTH && this.cX >= 0) {
      this.cX += (this.ball.cX - (this.cX + this.width / 2)) * 0.1;
    }

    if (this.cX + this.width > CANVAS_WIDTH || this.cX < 0) {
      this.cX = this.cX < 0 ? 0 : CANVAS_WIDTH - this.width;
    }
  }
}

//setup Ball
class Ball {
  constructor() {
    this.radius = 10;
    this.resetBall();
  }

  resetBall() {
    this.cX = CANVAS_WIDTH / 2;
    this.cY = CANVAS_HEIGHT / 2;
    this.speed = 5;
    this.velX = 3;
    this.velY = -3;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.cX, this.cY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    this.cX += this.velX;
    this.cY += this.velY;
  }
}

//setup Net

class Net {
  constructor() {
    this.cX = 0;
    this.cY = CANVAS_HEIGHT / 2 - 2 / 2;
    this.width = 10;
    this.height = 2;
    this.color = "black";
  }

  draw(ctx) {
    for (let i = 0; i < CANVAS_WIDTH; i += 15) {
      ctx.fillRect(this.cX + i, this.cY, this.width, this.height);
    }
  }
}

// setup Game
class GameController {
  constructor(ball, barcom, baruser) {
    this.setBall(ball);
    this.setBarCom(barcom);
    this.setBarUser(baruser);
  }

  setBall(ball) {
    this.ball = ball;
  }

  setBarCom(barcom) {
    this.barcom = barcom;
  }

  setBarUser(baruser) {
    this.baruser = baruser;
  }

  hit() {
    const left = this.ball.cX - this.ball.radius;
    const right = this.ball.cX + this.ball.radius;
    const top = this.ball.cY - this.ball.radius;
    const bottom = this.ball.cY + this.ball.radius;

    this.hitWall(left, right);
    this.hitBarCom(top, left, right);
    this.hitBarUser(bottom, left, right);
    this.hitAndReset(bottom, top);
  }

  //hit wall and repeat velX = -velX

  hitWall(left, right, bottom, top) {
    if (left <= 0 || right >= CANVAS_WIDTH) {
      this.ball.velX = -this.ball.velX;
    }
  }

  //hit BarCom and repeat velY = -velY , velX = .....
  hitBarCom(top, left, right) {
    const comtop = this.barcom.cY;
    const combottom = this.barcom.cY + this.barcom.height;
    const comleft = this.barcom.cX + this.barcom.height;
    const comright = comleft + this.barcom.width;

    const collidePoint =
      (this.ball.cX - (this.barcom.cX + this.barcom.width / 2)) /
      (this.barcom.width / 2);

    const angleRad = (Math.PI / 4) * collidePoint;

    if (top <= combottom && left <= comright && right >= comleft) {
      this.ball.velY = this.ball.speed * Math.cos(angleRad);
      this.ball.velX = this.ball.speed * Math.sin(angleRad);
      this.ball.speed += 0.1;
    }
  }

  //hit BarUser and repeat velY =- velY , velX = ....
  hitBarUser(bottom, left, right) {
    const usertop = this.baruser.cY;
    const userbottom = this.baruser.cY + this.height;
    const userleft = this.baruser.cX;
    const userright = this.baruser.cX + this.baruser.width;

    const collidepoint =
      (this.ball.cX - (this.baruser.cX + this.baruser.width / 2)) /
      (this.baruser.width / 2);

    const anglerad = (Math.PI / 4) * collidepoint;

    if (bottom >= usertop && left <= userright && right >= userleft) {
      console.log(`${this.ball.velY} ${this.ball.velX}`);

      this.ball.velY = -this.ball.speed * Math.cos(anglerad);
      this.ball.velX = this.ball.speed * Math.sin(anglerad);
      this.ball.speed += 0.1;

      console.log(`${this.ball.velY} ${this.ball.velX}`);
    }
  }

  //if ball go away canvas reset ball and + point
  hitAndReset(bottom, top) {
    if (bottom > CANVAS_HEIGHT) {
      this.barcom.point++;
      this.ball.resetBall();
    }

    if (top < 0) {
      this.baruser.point++;
      this.ball.resetBall();
    }
  }
}

const barUser = new BarUser();
const ball = new Ball();
const barCom = new BarCom(ball);
const gameBoard = new GameBoard(barCom, barUser);
const net = new Net();
const gameController = new GameController(ball, barCom, barUser);

//add key down and up for BarUser
function isValidKey(e) {
  if (e.repeat) return false;
  return e.keyCode === 37 || e.keyCode === 39;
}

function handKeyDown(e) {
  if (!isValidKey(e)) return;
  keys = e.keyCode;
  barUser.state = e.keyCode === 37 ? BAR_STATE.MOVE_LEFT : BAR_STATE.MOVE_RIGHT;
}

function handKeyUp(e) {
  if (!isValidKey(e)) return;
  if (keys === e.keyCode) {
    keys = undefined;
    barUser.state = BAR_STATE.IDLE;
  }
}

window.addEventListener("keydown", handKeyDown);
window.addEventListener("keyup", handKeyUp);

//run GameLoop

function gameLoop() {
  // ball.update();
  barUser.update();
  barCom.update();

  gameBoard.draw(ctx);
  gameBoard.drawText(ctd);
  barUser.draw(ctx);
  barCom.draw(ctx);
  ball.draw(ctx);
  net.draw(ctx);

  gameController.hit();

  requestAnimationFrame(gameLoop);
}

gameLoop();
