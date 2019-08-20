/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
/* eslint-disable class-methods-use-this */
/* eslint-disable eqeqeq */
/* eslint-disable radix */
// eslint-disable-next-line no-unused-vars
// const Enemy = require('./enemies/enemy');
// const Key = require('./key');
// const SpikeTrap = require('./spikeTrap');
// const MapPowerup = require('./mapPowerup');
// const WallBreakerPowerup = require('./wallBreakerPowerup');
// const SpeedPowerup = require('./speedPowerup');
// const KeyController = require('./keyController');

let keysCollected = 0;

module.exports = class MainCharacter {
  constructor(
    x,
    y,
    width,
    height,
    mazeSize,
    mazeArray,
    destroyedWalls,
    context,
    gameObjects,
    functToSwitch,
    callBlurb,
    resetCharacter,
  ) {
    this.image = new Image();
    this.image.src = './Art/2D/female2_spritesheet.png';
    this.camera = undefined;
    this.x = x;
    this.y = y;
    this.width = 128;
    this.height = 128;
    this.xDir = 0;
    this.yDir = 0;
    this.speed = 240;
    this.hSpeed = 0;
    this.vSpeed = 0;
    this.animationSpeed = 0.21;
    this.spriteDir = 0; // 0 = right, 1 = down, 2 = left, 3 = up.
    this.spriteIndexX = 0;
    this.spriteIndexY = 0;
    this.context = context;
    this.CWidth = width;
    this.CHeight = height;
    this.mazeSize = mazeSize;
    this.mazeArray = mazeArray;
    this.destroyedWalls = destroyedWalls;
    this.posTopX = parseInt(this.x / ((this.CWidth * 128) / this.CWidth));
    this.posTopY = parseInt(this.y / ((this.CHeight * 128) / this.CHeight));
    this.calcForSquareX = (this.CWidth * 128) / this.CWidth;
    this.moveRight = false;
    this.moveLeft = false;
    this.moveUp = false;
    this.moveDown = false;
    this.counter = 10;
    this.playerSpeedNormal = 4;
    this.playerSpeed = this.playerSpeedNormal;
    this.playerSpeedBoost = 8;
    this.speedBoostDuration = 6; // Seconds
    this.speedBoostTimer = this.speedBoostDuration;
    this.hasWallBreaks = false;
    this.keysCollected = keysCollected;
    this.hasMap = false;
    this.keyController = new KeyController();
    this.gameObjects = gameObjects;
    this.functToSwitch = functToSwitch;
    this.callBlurb = callBlurb;
    this.resetCharacter = resetCharacter;
    this.walkingSound = new Audio('./mp3/walking.wav');
    this.keySound = new Audio('./mp3/key.mp3');
    // this.walkingSound.volume = 1.5;
  }

  setImage(src) {
    this.image = new Image();
    this.image.src = src;
  }

  update(dt) {
    // 0.7071 is a magic constant for diagonal movement.
    this.counter++;
    this.hSpeed = 0;
    this.vSpeed = 0;
    if (this.moveRight) {
      this.checkMovePosX();
    }
    if (this.moveLeft) {
      this.checkMoveNegX();
    }
    if (this.moveDown) {
      this.checkMovePosY();
    }
    if (this.moveUp) {
      this.checkMoveNegY();
    }

    // Update speed boost timer.
    if (this.speedBoostTimer <= 0) {
      this.playerSpeed = this.playerSpeedNormal;
      this.speedBoostTimer = this.speedBoostDuration;
    } else {
      this.speedBoostTimer -= dt;
    }

    // Animate the sprite.
    this.spriteIndexX = (this.spriteIndexX + this.animationSpeed) % 8;

    if (this.xDir === 0 && this.yDir === 0) {
      this.spriteIndexX = this.spriteDir;
      this.spriteIndexY = 0;
    }

    if (this.yDir !== 0) {
      this.spriteDir = this.yDir === 1 ? 1 : 3;
      this.spriteIndexY = this.spriteDir + 1;
    }

    if (this.xDir !== 0) {
      this.spriteDir = this.xDir === 1 ? 0 : 2;
      this.spriteIndexY = this.spriteDir + 1;
    }

    if (this.xDir || this.yDir) {
      if (this.walkingSound.paused) {
        this.walkingSound.play();
      }
    } else {
      this.walkingSound.pause();
    }

    for (let j = 0; j < this.gameObjects.length; j++) {
      if (this.gameObjects[j] instanceof Enemy) {
        // Contact with enemy
        const enemy = this.gameObjects[j];
        if (
          this.x + this.width / 2 > enemy.x
          && this.x + this.width / 2 < enemy.x + enemy.width
          && this.y + this.height / 2 > enemy.y
          && this.y + this.height / 2 < enemy.y + enemy.height
        ) {
          this.gameObjects.splice(j, 1);
          this.functToSwitch();
        }
      }
      if (this.gameObjects[j] instanceof Key) {
        // Contact with key
        const key = this.gameObjects[j];
        if (
          this.x + this.width / 2 > key.x + 32
          && this.x + this.width / 2 < key.x + key.width - 32
          && this.y + this.height / 2 > key.y + key.height / 2 - 32
          && this.y + this.height / 2 + 32 < key.y + key.height / 2 + 32
        ) {
          this.keySound.play();
          this.gameObjects.splice(j, 1);
          // this.keysCollected += 1;
          this.callBlurb();
          if (this.keysCollected === this.keyController.maxSpawnKeys) {
            this.mazeArray[this.mazeSize - 2][this.mazeSize - 3] = 4;
            this.mazeArray[this.mazeSize - 3][this.mazeSize - 3] = 4;
            console.log(this.mazeArray);
          }
        }
      }
      if (this.gameObjects[j] instanceof SpikeTrap) {
        // Contect with spike trap.
        const trap = this.gameObjects[j];
        if (trap.spriteIndex >= 1.1) {
          if (
            this.x + this.width / 2 > trap.x
            && this.x + this.width / 2 < trap.x + trap.width
            && this.y + this.height / 2 > trap.y
            && this.y + this.height / 2 < trap.y + trap.height
          ) {
            this.resetCharacter();
          }
        }
      }
      if (this.gameObjects[j] instanceof MapPowerup) {
        const map = this.gameObjects[j];
        if (
          this.x + this.width / 2 > map.x
          && this.x + this.width / 2 < map.x + map.width
          && this.y + this.height / 2 > map.y
          && this.y + this.height / 2 < map.y + map.height
        ) {
          this.gameObjects.splice(j, 1);
          this.hasMap = true;
        }
      }
      if (this.gameObjects[j] instanceof WallBreakerPowerup) {
        if (!this.hasWallBreaks) {
          const wb = this.gameObjects[j];
          if (
            this.x + this.width / 2 > wb.x
            && this.x + this.width / 2 < wb.x + wb.width
            && this.y + this.height / 2 > wb.y
            && this.y + this.height / 2 < wb.y + wb.height
          ) {
            this.gameObjects.splice(j, 1);
            this.hasWallBreaks = true;
          }
        }
      }
      if (this.gameObjects[j] instanceof SpeedPowerup) {
        const speedBoost = this.gameObjects[j];
        if (
          this.x + this.width / 2 > speedBoost.x
          && this.x + this.width / 2 < speedBoost.x + speedBoost.width
          && this.y + this.height / 2 > speedBoost.y
          && this.y + this.height / 2 < speedBoost.y + speedBoost.height
        ) {
          this.gameObjects.splice(j, 1);
          this.playerSpeed = this.playerSpeedBoost;
          this.speedBoostActivated = true;
        }
      }
    }
  }

  draw(context, worldPosX, worldPosY) {
    // console.log('draw');
    context.drawImage(
      this.image,
      this.width * Math.floor(this.spriteIndexX),
      this.height * this.spriteIndexY + 1,
      this.width,
      this.height,
      this.x - worldPosX,
      this.y - worldPosY,
      128,
      128,
    );
    // context.fillStyle = 'rgba(0,0,0,0.5)';
    // context.fillRect(this.x + 50 - worldPosX, this.y - worldPosY + this.height, 28, -20);
  }

  checkMovePosX() {
    // this.posTopY = parseInt((this.y + this.height) / ((this.CHeight * 128) / this.CHeight));
    // this.posTopX = parseInt((this.x + 76 + this.playerSpeed) / ((this.CWidth * 128) / this.CWidth));
    // // console.log(`${this.posTopX} posTopY ${this.posTopY}`);
    // if (this.mazeArray[this.posTopX][this.posTopY] == 0) {
    //   this.hSpeed = this.playerSpeed;
    //   this.x += this.hSpeed;
    // }
    if (
      (this.mazeArray[Math.floor((this.x + 76 + this.playerSpeed) / this.width)][
        Math.floor((this.y + 20) / this.height)
      ] === 0
        && this.mazeArray[Math.floor((this.x + 76 + this.playerSpeed) / this.width)][
          Math.floor((this.y + this.height) / this.height)
        ] === 0)
      || (this.mazeArray[Math.floor((this.x + 76 + this.playerSpeed) / this.width)][
        Math.floor((this.y + 20) / this.height)
      ] === 4
        && this.mazeArray[Math.floor((this.x + 76 + this.playerSpeed) / this.width)][
          Math.floor((this.y + this.height) / this.height)
        ] === 4)
    ) {
      this.hSpeed = this.playerSpeed;
      this.x += this.hSpeed;
    }
  }

  checkMoveNegX() {
    // this.posTopY = parseInt((this.y + this.height) / ((this.CHeight * 128) / this.CHeight));
    // this.posTopX = parseInt((this.x + 52 - this.playerSpeed) / ((this.CWidth * 128) / this.CWidth));
    // // console.log(`${this.posTopX} posTopY ${this.posTopY}`);
    // if (this.mazeArray[this.posTopX][this.posTopY] == 0) {
    //   this.hSpeed = -this.playerSpeed;
    //   this.x += this.hSpeed;
    // }
    if (
      (this.mazeArray[Math.floor((this.x + 50 - this.playerSpeed) / this.width)][
        Math.floor((this.y + 20) / this.height)
      ] === 0
        && this.mazeArray[Math.floor((this.x + 50 - this.playerSpeed) / this.width)][
          Math.floor((this.y + this.height) / this.height)
        ] === 0)
      || (this.mazeArray[Math.floor((this.x + 50 - this.playerSpeed) / this.width)][
        Math.floor((this.y + 20) / this.height)
      ] === 0
        && this.mazeArray[Math.floor((this.x + 50 - this.playerSpeed) / this.width)][
          Math.floor((this.y + this.height) / this.height)
        ] === 0)
    ) {
      this.hSpeed = -this.playerSpeed;
      this.x += this.hSpeed;
    }
  }

  checkMovePosY() {
    // console.log('hello');
    // this.posTopY = parseInt(
    //   (this.y + this.height + this.playerSpeed) / ((this.CHeight * 128) / this.CHeight),
    // );
    // this.posTopX = parseInt((this.x + 50) / ((this.CWidth * 128) / this.CWidth));
    // if (this.mazeArray[this.posTopX][this.posTopY] == 0) {
    //   this.vSpeed = this.playerSpeed;
    //   this.y += this.vSpeed;
    // }
    // this.posTopX = parseInt((this.x + 50) / ((this.CWidth * 128) / this.CWidth));
    if (
      (this.mazeArray[Math.floor((this.x + 50) / this.width)][
        Math.floor((this.y + this.height + this.playerSpeed) / this.height)
      ] === 0
        && this.mazeArray[Math.floor((this.x + 76) / this.width)][
          Math.floor((this.y + this.height + this.playerSpeed) / this.height)
        ] === 0)
      || (this.mazeArray[Math.floor((this.x + 50) / this.width)][
        Math.floor((this.y + this.height + this.playerSpeed) / this.height)
      ] === 4
        && this.mazeArray[Math.floor((this.x + 76) / this.width)][
          Math.floor((this.y + this.height + this.playerSpeed) / this.height)
        ] === 4)
    ) {
      this.vSpeed = this.playerSpeed;
      this.y += this.vSpeed;
    }
  }

  checkMoveNegY() {
    // console.log('hello');
    // this.posTopY = parseInt(
    //   (this.y + 20 - this.playerSpeed) / ((this.CHeight * 128) / this.CHeight),
    // );
    // this.posTopX = parseInt((this.x + 50) / ((this.CWidth * 128) / this.CWidth));
    // if (this.mazeArray[this.posTopX][this.posTopY] == 0) {
    //   this.vSpeed = -this.playerSpeed;
    //   this.y += this.vSpeed;
    // }
    this.posTopX = parseInt((this.x + 50) / ((this.CWidth * 128) / this.CWidth));
    if (
      (this.mazeArray[Math.floor((this.x + 50) / this.width)][
        Math.floor((this.y + 20 - this.playerSpeed) / this.height)
      ] === 0
        && this.mazeArray[Math.floor((this.x + 76) / this.width)][
          Math.floor((this.y + 20 - this.playerSpeed) / this.height)
        ] === 0)
      || (this.mazeArray[Math.floor((this.x + 50) / this.width)][
        Math.floor((this.y + 20 - this.playerSpeed) / this.height)
      ] === 4
        && this.mazeArray[Math.floor((this.x + 76) / this.width)][
          Math.floor((this.y + 20 - this.playerSpeed) / this.height)
        ] === 4)
    ) {
      this.vSpeed = -this.playerSpeed;
      this.y += this.vSpeed;
    }
  }

  // Method to destroy walls.
  destroyWall() {
    if (!this.hasWallBreaks) {
      return;
    }
    let posX = Math.floor((this.x + this.width / 2) / 128);
    let posY = Math.floor((this.y + this.height / 2) / 128);
    switch (this.spriteDir) {
      case 0: // Right
        if (this.mazeArray[posX + 1][posY] === 1 && posX + 1 < this.mazeSize - 2) {
          this.mazeArray[posX + 1][posY] = 0;
          this.hasWallBreaks = false;
          this.destroyedWalls.push([posX + 1, posY]);
        }
        break;
      case 1: // Down
        if (this.mazeArray[posX][posY + 1] === 1 && posY + 1 < this.mazeSize - 2) {
          this.mazeArray[posX][posY + 1] = 0;
          this.hasWallBreaks = false;
          this.destroyedWalls.push([posX, posY + 1]);
        }
        break;
      case 2: // Left
        if (this.mazeArray[posX - 1][posY] === 1 && posX - 1 > 1) {
          this.mazeArray[posX - 1][posY] = 0;
          this.hasWallBreaks = false;
          this.destroyedWalls.push([posX - 1, posY]);
        }
        break;
      case 3: // Up
        if (this.mazeArray[posX][posY - 1] === 1 && posY - 1 > 1) {
          this.mazeArray[posX][posY - 1] = 0;
          this.hasWallBreaks = false;
          this.destroyedWalls.push([posX, posY - 1]);
        }
        break;
      default:
        break;
    }
  }
};
