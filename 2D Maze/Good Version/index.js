/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
const canvas = document.getElementById('2DMaze');
const miniMap = document.getElementById('miniMap');
const ctx = canvas.getContext('2d');
const ctxx = miniMap.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
miniMap.width = window.innerWidth / 7;
miniMap.height = window.innerWidth / 7;

// Load the tilemap.
const tilemap = new Image();
tilemap.src = './Art/2D/tilemap.png';

// eslint-disable-next-line no-unused-vars
const drawOrder = [];

let mapArray;
const mapSize = 29;

// FPS
let dt = 0;
let lastTime = Date.now();

// Define world position variables.
let worldPosX = 0;
let worldPosY = 0;

// eslint-disable-next-line no-undef

const enemyController = new EnemyController();
enemyController.enemies.push(new EnemyAnxiety(128, 120));
const Recursive = new RecursiveMaze(mapSize);
const Camera = new PlayerCamera(ctx);
Recursive.draw();
// eslint-disable-next-line prefer-const
mapArray = Recursive.array;
const Player = new MainCharacter(
  130,
  120,
  canvas.width,
  canvas.height,
  Recursive.MazeSize,
  mapArray,
  ctx,
  enemyController.enemies,
);
Camera.attachTo(Player);

// eslint-disable-next-line prefer-const

// Create the buffer image of the map.
const buffer = document.createElement('CANVAS').getContext('2d');
buffer.canvas.width = 128 * mapSize;
buffer.canvas.height = 128 * mapSize;
Camera.attachBuffer(buffer);
// console.log(`${buffer.canvas.width} ${buffer.canvas.height}`);

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
          break;
        case 1: // Walls
          if (y - 1 < 0) {
            if (mapArray[x][y + 1] === 0) {
              buffer.drawImage(tilemap, 0, 0, 128, 128, 128 * x, 128 * y, 128, 128);
            } else {
              buffer.drawImage(tilemap, 128, 0, 128, 128, 128 * x, 128 * y, 128, 128);
            }
          } else if (
            (mapArray[x][y + 1] === 0 && mapArray[x][y - 1] === 0)
            || (mapArray[x][y + 1] === 0 && mapArray[x][y - 1] === 1)
          ) {
            buffer.drawImage(tilemap, 0, 0, 128, 128, 128 * x, 128 * y, 128, 128);
          } else {
            buffer.drawImage(tilemap, 128, 0, 128, 128, 128 * x, 128 * y, 128, 128);
          }
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
          break;
        default:
          break;
      }
    }
  }
};

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyD':
    case "ArrowRight":
      Player.xDir = 1;
      Player.moveRight = true;
      Player.moveLeft = false;
      Player.moveDown = false;
      Player.moveUp = false;
      break;
    case 'KeyA':
    case "ArrowLeft":
      Player.xDir = -1;
      Player.moveLeft = true;
      Player.moveRight = false;
      Player.moveDown = false;
      Player.moveUp = false;
      break;
    case 'KeyW':
    case "ArrowUp":
      Player.yDir = -1;
      Player.moveUp = true;
      Player.moveRight = false;
      Player.moveDown = false;
      Player.moveLeft = false;
      break;
    case 'KeyS':
    case "ArrowDown":
      Player.yDir = 1;
      Player.moveDown = true;
      Player.moveRight = false;
      Player.moveUp = false;
      Player.moveLeft = false;
      break;
    default:
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyD':
    case "ArrowRight":
      Player.xDir = 0;
      Player.moveRight = false;
      break;
    case 'KeyA':
    case "ArrowLeft":
      Player.xDir = 0;
      Player.moveLeft = false;
      break;
    case 'KeyW':
    case "ArrowUp":
      Player.yDir = 0;
      Player.moveUp = false;
      break;
    case 'KeyS':
    case "ArrowLeft":
      Player.yDir = 0;
      Player.moveDown = false;
      break;
    default:
      break;
  }
});

const row = mapSize;
const col = mapSize;

function update() {
  // Calucute delta time.
  const nowTime = Date.now();
  dt = (nowTime - lastTime) / 1000;
  lastTime = nowTime;
  // console.log(deltaTime);

  // Update global position.
  // If the player moves half the distance of the camera's view dimensions
  // from the edges of the buffer(left = 0, top = 0, right = 128*col bottom = 128*row), it'll
  // move the world position as the player moves. We use the world position as the camera's
  // position and subtract the world position from the player's position(this makes the player move with the camera).
  if (
    Player.x + Player.width / 2 > Camera.vWidth / 2
    && Player.x + Player.width / 2 < buffer.canvas.width - Camera.vWidth / 2
  ) {
    worldPosX = Player.x + Player.width / 2 - Camera.vWidth / 2;
  }
  if (
    Player.y + Player.height / 2 > Camera.vHeight / 2
    && Player.y + Player.height / 2 < buffer.canvas.height - Camera.vHeight / 2
  ) {
    worldPosY = Player.y + Player.height / 2 - Camera.vHeight / 2;
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

  // Update the objects.
  Player.update(dt);
  Camera.update(dt);

  for (let i = 0; i < enemyController.enemies.length; i++) {
    const enemy = enemyController.enemies[i];
    enemy.update(dt);
    if (
      mapArray[
      Math.floor((enemy.x + enemy.width / 2 + (enemy.width / 2) * enemy.xDir) / enemy.width)
      ][Math.floor((enemy.y + enemy.height / 2) / enemy.height)] === 1
    ) {
      enemy.xDir *= -1;
    }
    if (
      mapArray[Math.floor((enemy.x + enemy.width / 2) / enemy.width)][
      Math.floor((enemy.y + enemy.height / 2 + (enemy.height / 2) * enemy.yDir) / enemy.height)
      ]
    ) {
      enemy.yDir *= -1;
    }
  }
}
let miniMapSquareToDeletX = 1;
let miniMapSquareToDeletY = 1;

function drawMiniMap() {
  ctxx.clearRect( // Clear previous player position
    miniMapSquareToDeletX * (miniMap.width / row),
    miniMapSquareToDeletY * (miniMap.height / col),
    (miniMap.width / row) * 0.95,
    (miniMap.height / col) * 0.95,
  );
  ctxx.fillStyle = 'rgba(0,128,0, 0.65)'; // Green Walls
  ctxx.fillRect( // Fill spot with green walls
    miniMapSquareToDeletX * (miniMap.width / row),
    miniMapSquareToDeletY * (miniMap.height / col),
    (miniMap.width / row) * 0.95,
    (miniMap.height / col) * 0.95,
  );
  ctxx.fillStyle = 'rgba(0,0,200,0.5)'; // Blue player dot
  ctxx.fillRect( // Draw new player position
    Math.floor((Player.x + Player.width / 2) / Player.width) * (miniMap.width / row),
    Math.floor((Player.y + Player.height - 4) / Player.height) * (miniMap.height / col),
    (miniMap.width / row) * 0.95,
    (miniMap.height / col) * 0.95,
  );
  miniMapSquareToDeletX = Math.floor((Player.x + Player.width / 2) / Player.width); // Player.posTopX;
  miniMapSquareToDeletY = Math.floor((Player.y + Player.height - 4) / Player.height); // Player.posTopY;
}
for (let x = 0; x < row; x++) {
  for (let y = 0; y < col; y++) {
    // eslint-disable-next-line default-case
    switch (mapArray[x][y]) {
      case 0:
        // console.log("No Wall");
        ctxx.fillStyle = 'rgba(0,128,0, 0.65)'; // Green Walls
        ctxx.fillRect(
          x * (miniMap.width / row),
          y * (miniMap.height / col),
          miniMap.width / row,
          miniMap.height / col,
        );
        break;
      case 1:
        console.log('Wall');
        ctxx.fillStyle = 'rgba(128,128,128,0.65)'; // Grey walls
        ctxx.fillRect(
          x * (miniMap.width / row),
          y * (miniMap.height / col),
          miniMap.width / row,
          miniMap.height / col,
        );
        break;
    }
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Camera.draw(worldPosX, worldPosY);
  // Player.draw(ctx, worldPosX, worldPosY);
  // Draws the player behind/infront of enemies depending on its y;
  let drewPlayer = false;
  for (let i = 0; i < enemyController.enemies.length; i++) {
    const enemy = enemyController.enemies[i];
    if (!drewPlayer) {
      if (Player.y < enemy.y) {
        Player.draw(ctx, worldPosX, worldPosY);
        enemy.draw(ctx, worldPosX, worldPosY);
      } else {
        enemy.draw(ctx, worldPosX, worldPosY);
        Player.draw(ctx, worldPosX, worldPosY);
      }
      drewPlayer = true;
    }
  }
  // ctx.fillText(`${worldPosX} ${worldPosX}`, 20, 20);
  if (miniMapSquareToDeletX != Player.posTopX || miniMapSquareToDeletY != Player.posTopY) {
    drawMiniMap();
  }
}
drawMiniMap();

function gameLoop() {
  window.requestAnimationFrame(gameLoop);
  update();
  draw();
}

window.requestAnimationFrame(gameLoop);
