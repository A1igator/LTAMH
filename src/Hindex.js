/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const Player = require('./PlayerClass');
const Block = require('./block');
const Teacher = require('./teacher');

module.exports = class miniGame {
  constructor(goBackTo2d, goBackTo2dBad, switchBackFromMiniAndReset, playerArt) {
    this.canvas = document.getElementById('minigameCanvas');
    this.mainCanvas = document.getElementById('backgroundCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.playerArt = playerArt;
    this.goBackTo2d = goBackTo2d;
    this.goBackTo2dBad = goBackTo2dBad;
    this.switchBackFromMiniAndReset = switchBackFromMiniAndReset;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.scene = {
      background: new Image(),
      ground: new Image(),
      foreground: new Image(),
    };

    this.scene.background.src = './Art/2D/minigame/background.png';
    this.scene.ground.src = './Art/2D/minigame/ground.png';
    this.scene.foreground.src = './Art/2D/minigame/foreground_detail.png';
    console.log(this.playerArt);
    console.log(this.playerArt.src);
    console.log(`${this.playerArt.src}player Art`);
    this.player = new Player(
      300,
      this.canvas.height / 2 + 100,
      128,
      128,
      this.ctx,
      this.playerArt.src,
    );
    this.floorHeight = this.player.y + this.player.H;
    // this.block = new Block(canvas.width, floorHeight - 80, 40, 80, 50, ctx);

    this.blockArray = [];
    this.blockArrayI = 0;
    this.blockSpeed = 20;
    console.log(this.blockArray);
    this.playerInput = false;
    this.jumping = false;
    this.jumpPower = 35;
    this.jumpDuration = 8;
    this.jumpCounter = 0;
    this.gravity = 20;
    this.gravityIsStrong = false;
    this.jumpingMultiplier = 1;
    this.falling = false;
    this.isJumping = false;

    this.numberOfBlocksPassed = 0;
    this.increasedDif = false;
    console.log(this.floorHeight);

    this.randomAmountOfTimeForSpawn = 30;
    this.maxAmountForRandomSpawn = 30;
    this.randomSpawn = 20;
    this.counterForSpawn = 0;

    this.inTransition = false;
    this.delayForTransition = 50;
    this.counterForTransition = 0;
    this.stopSpawning = false;

    this.teacher = new Teacher(this.canvas.width, this.floorHeight - 128, 30, 90, 10, this.ctx);
    this.endBlurbPos = document.getElementById('TwoDRunnerPositive');
    this.endBlurbNeg = document.getElementById('TwoDRunnerNegative');

    this.endBlurbDelay = 150;
    this.endBlurbDelayCounter = 0;

    this.hitBlock = false;

    this.handleEvent = (e) => {
      switch (e.type) {
        case 'keydown':
          switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
              if (!this.jumping) {
                // console.log("can jump");
                this.jumping = true;
                this.jumpCounter = 0;
                this.jumpingMultiplier = 1;
              } else {
                console.log('not alloud to jump');
              }
              break;
            case 'KeyS':
            case 'ArrowDown':
              if (!this.gravityIsStrong) {
                console.log('strong gravity');
                this.gravityIsStrong = true;
                this.gravity = this.gravity * 2;
              }
              break;
            default:
          }
          break;
        case 'keyup':
          switch (e.code) {
            case 'KeyW':
            case 'ArrowUp':
              this.playerInput = false;
              break;
            case 'KeyS':
            case 'ArrowDown':
              if (this.gravityIsStrong) {
                this.gravityIsStrong = false;
                this.gravity = this.gravity / 2;
              }
              break;
            default:
          }
          break;
        default:
          break;
      }
    };
  }
  // addBlock();

  start() {
    // console.log(this.blockArray);
    this.mainInterval = setInterval(this.gameLoop.bind(this), 33);

    document.addEventListener('keydown', this);
    document.addEventListener('keyup', this);
  }

  gameLoop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.scene.background,
      this.ctx.canvas.width / 2 - 1600 / 2,
      this.ctx.canvas.height / 2 - 720 / 2,
    );
    this.ctx.drawImage(this.scene.ground, this.ctx.canvas.width / 2 - 1032 / 2, this.floorHeight);
    if (this.numberOfBlocksPassed >= 15 || this.hitBlock) {
      this.stopSpawning = true;
      if (this.blockArray.length <= 0 || this.hitBlock) {
        // console.log('inTransiton');
        this.inTransition = true;
        if (this.teacher.x - 200 <= this.player.x || this.hitBlock) {
          console.log(this.endBlurb);
          if (!this.hitBlock) {
            this.endBlurbPos.style.display = 'block';
          } else {
            this.endBlurbNeg.style.display = 'block';
            for (let x = 0; x < this.blockArray.length; x++) {
              this.blockArray[x].draw();
            }
          }
          this.teacher.draw();
          // console.log('startin convo');
          if (this.endBlurbDelayCounter == this.endBlurbDelay) {
            document.removeEventListener('keydown', this);
            document.removeEventListener('keyup', this);
            this.canvas.style.display = 'none';
            this.mainCanvas.style.display = 'block';
            this.endBlurbPos.style.display = 'none';
            this.endBlurbNeg.style.display = 'none';
            clearInterval(this.mainInterval);
            if (!this.hitBlock) {
              this.goBackTo2d();
            } else {
              console.log('go back to bad');
              console.log(this.goBackTo2dBad);
              this.switchBackFromMiniAndReset();
              this.goBackTo2dBad();
            }

            // console.log('collision');
          } else {
            this.endBlurbDelayCounter++;
          }
        } else {
          this.teacher.update();
          this.teacher.draw();
        }
      }
    }
    /*
     */
    if (!this.hitBlock) {
      if (!this.stopSpawning) {
        if (this.counterForSpawn >= this.randomSpawn) {
          console.log('spawn');
          this.randomSpawn = Math.floor(Math.random() * this.maxAmountForRandomSpawn + 20);
          this.counterForSpawn = 0;
          this.addBlock();
        } else {
          this.counterForSpawn++;
        }
      }
      /*
       */
      // console.log(this.blockArray);
      for (let x = 0; x < this.blockArray.length; x++) {
        if (!this.blockArray[x].update()) {
          this.increasedDif = false;
          this.numberOfBlocksPassed++;
          this.blockArray.shift();
        }
        this.blockArray[x].draw();
        if (
          this.player.x + this.player.W - 25 >= this.blockArray[x].x
          && this.player.x + 25 <= this.blockArray[x].x + this.blockArray[x].w
          && this.player.y + this.player.H - 10 >= this.blockArray[x].y
        ) {
          this.hitBlock = true;
        }
      }
      if (this.numberOfBlocksPassed % 4 == 0 && !this.increasedDif) {
        console.log('increased speed');
        this.maxAmountForRandomSpawn -= 2;
        this.blockSpeed += 3;
        this.increasedDif = true;
      }
      /*
       */
      if (this.jumping) {
        /*
         */
        this.jumpCounter++;
        // console.log(jumpCounter + " jumpCounter");
        if (this.jumpCounter >= this.jumpDuration) {
          // console.log("jumping is false;");
          // console.log(jumping);
          if (this.player.y + this.player.H <= this.floorHeight - this.gravity) {
            // console.log("gravity");
            this.player.y += this.gravity;
          } else {
            this.player.y = this.floorHeight - this.player.H;
            this.jumping = false;
          }
        } else {
          this.player.y -= this.jumpPower * this.jumpingMultiplier;
          this.jumpingMultiplier *= 0.9;
        }
      }
    }
    /*
     */
    this.player.draw();
    this.ctx.drawImage(
      this.scene.foreground,
      this.ctx.canvas.width / 2 - 1600 / 2,
      this.ctx.canvas.height / 2 - 720 / 2,
    );
  }

  addBlock() {
    // console.log(this.blockArray);
    const randomHeight = Math.floor(Math.random() * 40 + 40);
    this.blockArray.push(
      new Block(
        this.canvas.width,
        this.floorHeight - randomHeight,
        40,
        randomHeight,
        this.blockSpeed,
        this.ctx,
      ),
    );
  }
};

// const block = new Block(canvas.width, floorHeight - 80, 40, 80, 50, ctx);
