/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
global.canvas = document.getElementById('backgroundCanvas');
global.ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// const Menu = require('./menu.js');
// const MiniGame = require('./Hindex');
const Enemy = require('./enemies/enemy');
// const PowerupController = require('./powerupController');
// const MapPowerup = require('./mapPowerup');
// const Key = require('./key');
// const SpikeTrap = require('./spikeTrap');
// const TrapController = require('./trapController');
const EnemyController = require('./enemyController');
// const KeyController = require('./keyController');
const RecursiveMaze = require('./RecursiveMaze');
const PlayerCamera = require('./camera');
// const MainCharacter = require('./2DMainChar');

const blurbPage = document.getElementById('blurbPage');
// const csx = blurbPage.getContext('2d');

// const blurb = document.getElementById('blurb');

const music = new Audio('./mp3/Ivarelli - Fast and Sad.mp3');
music.volume = 0.5;

const doorOpenSound = new Audio('./mp3/doorOpen.mp3');
// const cxx = blurb.getContext('2d');

console.log(canvas);

// Load the tilemap.
const tilemap = new Image();
tilemap.src = './Art/2D/tilemap.png';

const doorTilemap = new Image();
doorTilemap.src = './Art/2D/door_spritesheet.png';

const spriteKeysCollected = new Image();
spriteKeysCollected.src = './Art/2D/keys_collected.png';

const spriteWallBreakerIndicator = new Image();
spriteWallBreakerIndicator.src = './Art/2D/wall_breaker_indicator.png';

// eslint-disable-next-line no-unused-vars
const gameObjects = [];

let mapArray;
const destroyedWalls = []; // [x, y] cell positions of destroyed walls.
const mapSize = 15;

let needsToReset = false;

// FPS
let dt = 0;
let lastTime = Date.now();

// Define world position variables.T
let worldPosX = 0;
let worldPosY = 0;

const enemyController = new EnemyController();
// const trapController = new TrapController();
// const keyController = new KeyController();
// const powerupController = new PowerupController();
const Recursive = new RecursiveMaze(mapSize);
const Camera = new PlayerCamera(ctx);
Recursive.draw();
const divToDrawTo = document.getElementById('backgroundCanvas');
const miniGameCanvas = document.getElementById('minigameCanvas');
const image = new Image();
image.id = 'pic';
let toResetPlayerToBeggingOfMaze = 0;
function switchBackFromMini() {
  InThreeD = false;
  gameLoop();
}

function switchBackFromMiniAndReset() {
  console.log('switchBackFromMiniAndReset');
  needsToReset = true;
  InThreeD = false;
  gameLoop();
}

const switchToMiniGame = () => {
  miniGameCanvas.style.display = 'block';
  divToDrawTo.style.display = 'none';
  const minigame = new MiniGame(switchBackFromMini, otherRest, switchBackFromMiniAndReset);
  InThreeD = true;
  minigame.start();
};
mapArray = Recursive.array;
function switchBack() {
  InThreeD = false;
}

// const Player = new MainCharacter(
//   130,
//   120,
//   // 128 * (mapSize - 2), // For testing exit.
//   // 128 * (mapSize - 2), // For testing exit.
//   canvas.width,
//   canvas.height,
//   Recursive.MazeSize,
//   mapArray,
//   destroyedWalls,
//   ctx,
//   gameObjects,
//   // eslint-disable-next-line no-use-before-define
//   switchToMiniGame,
//   // enemyController.enemies,
//   callBlurb,
//   otherRest,
// );

// const menu = new Menu(switchBackTo2D, Player);
// menu.start();

// gameObjects.push(Player);
enemyController.spawnEnemies(mapArray, gameObjects);
// trapController.spawnTraps(mapArray, gameObjects);
// keyController.spawnKeys(mapArray, gameObjects);
// powerupController.spawnPowerups(mapArray, gameObjects);

// let randX;
// let randY;
// do {
//   randX = Math.floor(Math.random() * mapSize);
//   randY = Math.floor(Math.random() * mapSize);
// } while (mapArray[randX][randY] !== 0);
// gameObjects.push(new MapPowerup(randX * 128, randY * 128));

// Camera.attachTo(Player);

let InThreeD = false;
let doorPlaying = false;

// eslint-disable-next-line prefer-const

// create minimap
const minimap = document.createElement('canvas').getContext('2d');
minimap.canvas.width = window.innerWidth / 7.2;
minimap.canvas.height = minimap.canvas.width;
const minimapPosX = canvas.width - minimap.canvas.width - 32;
const minimapPosY = 32;
const minimapAlpha = 0.7;

// Create the buffer image of the map.
const buffer = document.createElement('CANVAS').getContext('2d');
buffer.canvas.width = 128 * mapSize;
buffer.canvas.height = 128 * mapSize;
Camera.attachBuffer(buffer);
// console.log(`${buffer.canvas.width} ${buffer.canvas.height}`);

// worldPosX = Player.x + Player.width / 2 - Camera.vWidth / 2; // For testing exit.
// worldPosY = Player.y + Player.height / 2 - Camera.vHeight / 2;

// Create the image buffer of the map.
tilemap.onload = () => {
  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
      switch (mapArray[x][y]) {
        case 0: // Ground
          // 3 different ground tiles(2, 3, 4).
          // https://stackoverflow.com/a/4960020 for random number between two numbers.
          buffer.drawImage(
            tilemap,
            128 * Math.floor(Math.random() * (4 - 2 + 1) + 2),
            0,
            128,
            128,
            128 * x,
            128 * y,
            128,
            128,
          );
          minimap.fillStyle = `rgba(83, 244, 65, ${minimapAlpha})`;
          minimap.fillRect(
            (x * minimap.canvas.width) / mapSize,
            (y * minimap.canvas.height) / mapSize,
            minimap.canvas.width / mapSize,
            minimap.canvas.height / mapSize,
          );
          break;
        case 1: // Walls
          // if (y - 1 < 0) {
          //   if (mapArray[x][y + 1] === 0) {
          //     buffer.drawImage(tilemap, 0, 0, 128, 128, 128 * x, 128 * y, 128, 128);
          //   } else {
          //     buffer.drawImage(tilemap, 128, 0, 128, 128, 128 * x, 128 * y, 128, 128);
          //   }
          // } else if (
          //   (mapArray[x][y + 1] === 0 && mapArray[x][y - 1] === 0)
          //   || (mapArray[x][y + 1] === 0 && mapArray[x][y - 1] === 1)
          // ) {
          //   buffer.drawImage(tilemap, 0, 0, 128, 128, 128 * x, 128 * y, 128, 128);
          // } else {
          //   buffer.drawImage(tilemap, 128, 0, 128, 128, 128 * x, 128 * y, 128, 128);
          // }
          buffer.drawImage(tilemap, 128, 0, 128, 128, 128 * x, 128 * y, 128, 128);
          minimap.fillStyle = `rgba(56, 56, 56, ${minimapAlpha})`;
          minimap.fillRect(
            (x * minimap.canvas.width) / mapSize,
            (y * minimap.canvas.height) / mapSize,
            minimap.canvas.width / mapSize,
            minimap.canvas.height / mapSize,
          );
          break;
        case 3: // Exit
          // 3 different ground tiles(2, 3, 4).
          // https://stackoverflow.com/a/4960020 for random number between two numbers.
          buffer.drawImage(
            tilemap,
            128 * Math.floor(Math.random() * (4 - 2 + 1) + 2),
            0,
            128,
            128,
            128 * x,
            128 * y,
            128,
            128,
          );
          minimap.fillStyle = `rgba(83, 244, 65, ${minimapAlpha})`;
          minimap.fillRect(
            (x * minimap.canvas.width) / mapSize,
            (y * minimap.canvas.height) / mapSize,
            minimap.canvas.width / mapSize,
            minimap.canvas.height / mapSize,
          );
          break;
        default:
          break;
      }
    }
  }
};
// document.addEventListener('keydown', (event) => {
//   switch (event.code) {
//     case 'KeyD':
//     case 'ArrowRight':
//       Player.xDir = 1;
//       Player.moveRight = true;
//       Player.moveLeft = false;
//       Player.moveDown = false;
//       Player.moveUp = false;
//       break;
//     case 'ArrowLeft':
//     case 'KeyA':
//       Player.xDir = -1;
//       Player.moveLeft = true;
//       Player.moveRight = false;
//       Player.moveDown = false;
//       Player.moveUp = false;
//       break;
//     case 'ArrowUp':
//     case 'KeyW':
//       Player.yDir = -1;
//       Player.moveUp = true;
//       Player.moveRight = false;
//       Player.moveDown = false;
//       Player.moveLeft = false;
//       break;
//     case 'ArrowDown':
//     case 'KeyS':
//       Player.yDir = 1;
//       Player.moveDown = true;
//       Player.moveRight = false;
//       Player.moveUp = false;
//       Player.moveLeft = false;
//       break;
//     case 'KeyB':
//       // Call player's method to destroy wall.
//       Player.destroyWall();
//       break;
//     // case 'Space':
//     //   // switchToThreeD();
//     //   switchToMiniGame();
//     //   break;
//     case 'KeyR':
//       resetTheWholeMaze();
//       break;
//     default:
//       break;
//   }
// });

// document.addEventListener('keyup', (event) => {
//   switch (event.code) {
//     case 'ArrowRight':
//     case 'KeyD':
//       Player.xDir = 0;
//       Player.moveRight = false;
//       break;
//     case 'ArrowLeft':
//     case 'KeyA':
//       Player.xDir = 0;
//       Player.moveLeft = false;
//       break;
//     case 'ArrowUp':
//     case 'KeyW':
//       Player.yDir = 0;
//       Player.moveUp = false;
//       break;
//     case 'ArrowDown':
//     case 'KeyS':
//       Player.yDir = 0;
//       Player.moveDown = false;
//       break;
//     default:
//       break;
//   }
// });

function update() {
  const nowTime = Date.now();
  dt = (nowTime - lastTime) / 1000;
  lastTime = nowTime;
  // if (needsToReset) {
  //   console.log('FUCKING FUCKING !!!!!!!!!!!!!!!!!!!!!!');
  //   needsToReset = false;
  //   worldPosX = Player.x + Player.width / 2 - Camera.vWidth / 2;
  //   worldPosY = Player.y + Player.height / 2 - Camera.vHeight / 2;
  //   Camera.xDir = 0;
  //   Camera.yDir = 0;
  //   Camera.update(dt);
  //   Camera.draw();
  // }
  // Calucute delta time.

  // console.log(deltaTime);

  // Update global position.
  // If the player moves half the distance of the camera's view dimensions
  // from the edges of the buffer(left = 0, top = 0, right = 128*col bottom = 128*row), it'll
  // move the world position as the player moves. We use the world position as the camera's
  // position and subtract the world position from the player's position(this makes the player move with the camera).
  // if (
  //   Player.x + Player.width / 2 > Camera.vWidth / 2
  //   && Player.x + Player.width / 2 < buffer.canvas.width - Camera.vWidth / 2
  // ) {
  //   worldPosX = Player.x + Player.width / 2 - Camera.vWidth / 2;
  // }
  // if (
  //   Player.y + Player.height / 2 > Camera.vHeight / 2
  //   && Player.y + Player.height / 2 < buffer.canvas.height - Camera.vHeight / 2
  // ) {
  //   worldPosY = Player.y + Player.height / 2 - Camera.vHeight / 2;
  // }
  // Update the objects.
  // Player.update(dt);
  Camera.update(dt);

  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].update(dt);
    if (gameObjects[i] instanceof Enemy) {
      const enemy = gameObjects[i];
      worldPosX = enemy.x + enemy.width / 2 - Camera.vWidth / 2;
      worldPosY = enemy.y + enemy.height / 2 - Camera.vHeight / 2;
      // if (
      //   mapArray[
      //   Math.floor((enemy.x + enemy.width / 2 + (enemy.width / 2) * enemy.xDir) / enemy.width)
      //   ][Math.floor((enemy.y + enemy.height / 2) / enemy.height)] !== 0
      // ) {
      //   enemy.xDir *= -1;
      // }
      // if (
      //   mapArray[Math.floor((enemy.x + enemy.width / 2) / enemy.width)][
      //   Math.floor((enemy.y + enemy.height - 16 + (enemy.height / 2) * enemy.yDir) / enemy.height)
      //   ] !== 0
      // ) {
      //   enemy.yDir *= -1;
      // }

      // Sometimes the enemies spawn outside the maze.
      // This prevents them from doing so.
      while (enemy.y <= 0) {
        enemy.y += 2;
      }
      while (enemy.y >= (mapSize - 1) * 128) {
        enemy.y -= 2;
      }
      while (enemy.x <= 0) {
        enemy.x += 2;
      }
      while (enemy.x >= (mapSize - 1) * 128) {
        enemy.x -= 2;
      }

      // x collision
      // if (enemy.xDir === 1) {
      //   // Right collision
      //   if (
      //     mapArray[Math.floor((enemy.x + enemy.width / 2 + enemy.width / 4) / enemy.width)][
      //     Math.floor((enemy.y + enemy.height / 2) / enemy.height)
      //     ] !== 0
      //   ) {
      //     // The 4 is to make sure the enemy collides close enough to the wall.
      //     enemy.xDir = -1;
      //   }
      // } else if (enemy.xDir === -1) {
      //   // Left collision
      //   if (
      //     mapArray[Math.floor((enemy.x + enemy.width / 2 - enemy.width / 4) / enemy.width)][
      //     Math.floor((enemy.y + enemy.height / 2) / enemy.height)
      //     ] !== 0
      //   ) {
      //     // The 4 is to make sure the enemy collides close enough to the wall.
      //     enemy.xDir = 1;
      //   }
      // }

      // // y collision
      // if (enemy.yDir === 1) {
      //   // Down collision
      //   if (
      //     mapArray[Math.floor((enemy.x + enemy.width / 2) / enemy.width)][
      //     Math.floor((enemy.y + enemy.height - 24 + enemy.height / 4) / enemy.height)
      //     ] !== 0
      //   ) {
      //     // The 24 is to make sure the enemy collides close enough to the bottom wall.
      //     // The 4 is to make sure the enemy collides close enough to the wall.
      //     enemy.yDir *= -1;
      //   }
      // } else if (enemy.yDir === -1) {
      //   // Up collision
      //   if (
      //     mapArray[Math.floor((enemy.x + enemy.width / 2) / enemy.width)][
      //     Math.floor((enemy.y + enemy.height - enemy.height / 4) / enemy.height)
      //     ] !== 0
      //   ) {
      //     // The 4 is to make sure the enemy collides close enough to the wall.
      //     enemy.yDir *= -1;
      //   }
      // }

      // if (mapArray[Math.floor((enemy.x + enemy.width / 2 + (enemy.width / 4 * enemy.xDir)) / enemy.width)]
      // [Math.floor((enemy.y + enemy.height / 2) / enemy.height)] !== 0) {
      //   enemy.xDir *= -1;
      // }

      // // y collision.
      // if (mapArray[Math.floor((enemy.x + enemy.width / 2) / enemy.width)]
      // [Math.floor((enemy.y + enemy.height - (enemy.yDir === 1 ? 24 : 0) + (enemy.height / 4 * enemy.yDir)) / enemy.height)] !== 0) {
      //   enemy.yDir *= -1;
      // }
    }

    // Lock the world position
    if (worldPosX <= 0) {
      worldPosX = 0;
    } else if (worldPosX >= buffer.canvas.width - Camera.vWidth) {
      worldPosX = buffer.canvas.width - Camera.vWidth;
    }
    if (worldPosY <= 0) {
      worldPosY = 0;
    } else if (worldPosY >= buffer.canvas.height - canvas.height) {
      worldPosY = buffer.canvas.height - canvas.height;
    }
  }

  // if (Math.floor(Player.x / Player.width) >= mapSize - 1) {
  //   switchToThreeD();
  // }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Camera.draw(worldPosX, worldPosY);
  // Player.draw(ctx, worldPosX, worldPosY);

  // Draw destroyed walls.
  for (let i = 0; i < destroyedWalls.length; i++) {
    ctx.drawImage(
      tilemap,
      128 * 2,
      0,
      128,
      128,
      destroyedWalls[i][0] * 128 - worldPosX,
      destroyedWalls[i][1] * 128 - worldPosY,
      128,
      128,
    );
  }

  // draw door.
  // if (Player.keysCollected === keyController.maxSpawnKeys) {
  //   // Opened doors.
  //   if (!doorPlaying) {
  //     doorPlaying = true;
  //     doorOpenSound.play();
  //   }
  //   ctx.drawImage(
  //     doorTilemap,
  //     128,
  //     0,
  //     128,
  //     128,
  //     128 * (mapSize - 1) - worldPosX,
  //     128 * (mapSize - 3) - worldPosY,
  //     128,
  //     128,
  //   );
  //   ctx.drawImage(
  //     doorTilemap,
  //     128,
  //     128,
  //     128,
  //     128,
  //     128 * (mapSize - 1) - worldPosX,
  //     128 * (mapSize - 2) - worldPosY,
  //     128,
  //     128,
  //   );
  // } else {
  //   // Closed doors.
  //   ctx.drawImage(
  //     doorTilemap,
  //     0,
  //     0,
  //     128,
  //     128,
  //     128 * (mapSize - 1) - worldPosX,
  //     128 * (mapSize - 3) - worldPosY,
  //     128,
  //     128,
  //   );
  //   ctx.drawImage(
  //     doorTilemap,
  //     0,
  //     128,
  //     128,
  //     128,
  //     128 * (mapSize - 1) - worldPosX,
  //     128 * (mapSize - 2) - worldPosY,
  //     128,
  //     128,
  //   );
  // }

  // Sort the game objects based on its y.
  gameObjects.sort((a, b) => {
    // if (a instanceof SpikeTrap) {
    //   return -1;
    // }
    // if (b instanceof SpikeTrap) {
    //   return 1;
    // }
    if (a instanceof Key) {
      if (a.y - a.height / 2 > b.y) {
        return 1;
      }
      return -1;
    }
    if (b instanceof Key) {
      if (b.y - b.height / 2 > a.y) {
        return -1;
      }
      return 1;
    }
    if (a.y > b.y) {
      return 1;
    }
    return -1;
  });

  const mapEnemies = [];

  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].draw(ctx, worldPosX, worldPosY);
    if (gameObjects[i] instanceof Enemy) {
      mapEnemies.push(gameObjects[i]);
      //   const enemy = gameObjects[i];
      //   ctx.fillStyle = 'red';
      //   ctx.fillRect(
      //     minimapPosX
      //       + (Math.floor((enemy.x + enemy.width / 2) / enemy.width) * minimap.canvas.width) / mapSize,
      //     minimapPosY
      //       + (Math.floor((enemy.y + enemy.height - 4) / enemy.height) * minimap.canvas.height)
      //         / mapSize,
      //     minimap.canvas.width / mapSize,
      //     minimap.canvas.height / mapSize,
      //   );
    }
  }

  // Draw the wall breaker indicator.
  // if (!Player.hasWallBreaks) {
  //   ctx.drawImage(
  //     spriteWallBreakerIndicator,
  //     0,
  //     0,
  //     96,
  //     96,
  //     20,
  //     20,
  //     96,
  //     96,
  //   );
  // } else {
  //   ctx.drawImage(
  //     spriteWallBreakerIndicator,
  //     96,
  //     0,
  //     96,
  //     96,
  //     20,
  //     20,
  //     96,
  //     96,
  //   );
  // }

  // Draw keys collected.
  // ctx.drawImage(
  //   spriteKeysCollected,
  //   0,
  //   (Player.keysCollected * 384) / 4,
  //   288,
  //   384 / 4,
  //   20 + 96,
  //   20,
  //   288,
  //   384 / 4,
  // );

  // if (Player.hasMap) {
  // Draw minimap and player.
  // ctx.drawImage(minimap.canvas, minimapPosX, minimapPosY);
  // ctx.fillStyle = 'blue';
  // ctx.fillRect(
  //   minimapPosX
  //   + (Math.floor((Player.x + Player.width / 2) / Player.width) * minimap.canvas.width) / mapSize,
  //   minimapPosY
  //   + (Math.floor((Player.y + Player.height / 2) / Player.height) * minimap.canvas.height)
  //   / mapSize,
  //   minimap.canvas.width / mapSize,
  //   minimap.canvas.height / mapSize,
  //   );

  for (let i = 0; i < destroyedWalls.length; i++) {
    ctx.fillStyle = `rgba(83, 244, 65, ${minimapAlpha})`;
    ctx.fillRect(
      minimapPosX + (destroyedWalls[i][0] * minimap.canvas.width) / mapSize,
      minimapPosY + (destroyedWalls[i][1] * minimap.canvas.height) / mapSize,
      minimap.canvas.width / mapSize,
      minimap.canvas.height / mapSize,
    );
  }

  for (let i = 0; i < mapEnemies.length; i++) {
    const enemy = mapEnemies[i];
    ctx.fillStyle = 'red';
    ctx.fillRect(
      minimapPosX
      + (Math.floor((enemy.x + enemy.width / 2) / enemy.width) * minimap.canvas.width) / mapSize,
      minimapPosY
      + (Math.floor((enemy.y + enemy.height - 4) / enemy.height) * minimap.canvas.height)
      / mapSize,
      minimap.canvas.width / mapSize,
      minimap.canvas.height / mapSize,
    );
  }
}

const arrBlurbs = [];

arrBlurbs[0] = 'Value Yourself\nTreat yourself with kindness and respect, and avoid self-criticism. Make time for your hobbies and favorite projects, or broaden your horizons. Do a daily crossword puzzle, plant a garden, take dance lessons, learn to play an instrument or become fluent in another language.';
arrBlurbs[1] = 'Take care of your body\nTaking care of yourself physically can improve your mental health. Be sure to eat nutritious meals, avoid cigarettes, drink plenty of water, exercise, which helps decrease depression and anxiety and improve moods, get enough sleep. Researchers believe that lack of sleep contributes to a high rate of depression in college students.';
arrBlurbs[2] = 'Surround yourself with good people\nPeople with strong family or social connections are generally healthier than those who lack a support network. Make plans with supportive family members and friends, or seek out activities where you can meet new people, such as a club, class or support group.';
arrBlurbs[3] = "Give yourself\nVolunteer your time and energy to help someone else. You'll feel good about doing something tangible to help someone in need — and it's a great way to meet new people.";
arrBlurbs[4] = 'Learn how to deal with stress\nLike it or not, stress is a part of life. Practice good coping skills: do Tai Chi, exercise, take a nature walk, play with your pet or try journal writing as a stress reducer. Also, remember to smile and see the humor in life. Research shows that laughter can boost your immune system, ease pain, relax your body and reduce stress.';
arrBlurbs[5] = 'Queit your mind\nTry meditating, mindfulness and/or prayer. Relaxation exercises and prayer can improve your state of mind and outlook on life. In fact, research shows that meditation may help you feel calm and enhance the effects of therapy.';
arrBlurbs[6] = "Set realistic goals\nDecide what you want to achieve academically, professionally and personally, and write down the steps you need to realize your goals. Aim high, but be realistic and don't over-schedule. You'll enjoy a tremendous sense of accomplishment and self-worth as you progress toward your goal.";
arrBlurbs[7] = 'Break up the monotony\nAlthough our routines make us more efficient and enhance our feelings of security and safety, a little change of pace can perk up a tedious schedule. Alter your jogging route, plan a road-trip, take a walk in a different park, hang some new pictures or try a new restaurant.';
arrBlurbs[8] = 'Avoid alcohol and other drugs\nKeep alcohol use to a minimum and avoid other drugs. Sometimes people use alcohol and other drugs to "self-medicate" but in reality, alcohol and other drugs only aggravate problems.';
arrBlurbs[9] = 'Get help when you need it\nSeeking help is a sign of strength — not a weakness. And it is important to remember that treatment is effective. People who get appropriate care can recover from mental illness and addiction and lead full, rewarding lives.';


function callBlurb() {
  console.log('BLURB');
  this.keysCollected += 1;
  blurbPage.style.display = 'block';
  canvas.style.display = 'none';
  divToDrawTo.style.display = 'none';
  console.log(this.keysCollected);
}

function gameLoop() {
  if (needsToReset) {
    needsToReset = false;
    update();
  }
  if (music.paused) {
    music.play();
  }
  if (!InThreeD) {
    window.requestAnimationFrame(gameLoop);
    update();
    draw();
  } else {
    // console.log('not running 2d');
  }
}
function switchBackTo2D() {
  console.log('2d is back');
  if (InThreeD) {
    InThreeD = false;
  }
  gameLoop();
}
const runnerDiv = document.getElementById('TwoDRunnerPositive');
function funToCheckForSwitchBack() {
  // console.log('checkingFor3d');
  if (divToDrawTo.style.display == 'block') {
    switchBackTo2D();
    clearInterval(checkForSwitchBackInerval);
    // console.log('back 2d');
  }
}
let checkForSwitchBackInerval;
function switchToThreeD() {
  console.log('switched back to 3d');
  divToDrawTo.style.display = 'none';
  InThreeD = true;
  checkForSwitchBackInerval = setInterval(funToCheckForSwitchBack, 33);
}

toResetPlayerToBeggingOfMaze = () => {
  console.log('hi');
  worldPosX = Player.x + Player.width / 2 - Camera.vWidth / 2;
  worldPosY = Player.y + Player.height / 2 - Camera.vHeight / 2;
  const nowTime = Date.now();
  dt = (nowTime - lastTime) / 1000;
  lastTime = nowTime;
  Camera.xDir = 0;
  Camera.yDir = 0;
  Camera.update(dt);
  Camera.draw();
};

// const delay = ms => new Promise(res => setTimeout(res, ms));

// function otherRest() {
//   Player.x = 130;
//   Player.y = 120;
//   // console.log('hi other reset is this happening');
//   worldPosX = Player.x + Player.width / 2 - Camera.vWidth / 2;
//   worldPosY = Player.y + Player.height / 2 - Camera.vHeight / 2;
//   const nowTime = Date.now();
//   dt = (nowTime - lastTime) / 1000;
//   lastTime = nowTime;
//   Camera.xDir = 0;
//   Camera.yDir = 0;
//   Camera.update(dt);
//   Camera.draw();
//   // debugger;
// }
// function resetTheWholeMaze() {
//   console.log('reseting the whole maze');
//   Recursive.draw();
//   Recursive.MazeSize += 10;
//   mapArray = Recursive.array;
//   otherRest();
//   InThreeD = false;
//   tilemap.onload();
//   Player.reset(Recursive.array, Recursive.MazeSize);
//   // gameLoop();
// }
window.requestAnimationFrame(gameLoop);
