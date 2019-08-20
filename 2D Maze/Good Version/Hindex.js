/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const canvas = document.getElementById('2DMaze');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scene = {
  background: new Image(),
  ground: new Image(),
  foreground: new Image(),
};

scene.background.src = './Art/2D/minigame/background.png';
scene.ground.src = './Art/2D/minigame/ground.png';
scene.foreground.src = './Art/2D/minigame/foreground_detail.png';

const player = new Player(300, canvas.height / 2 + 100, 30, 90, ctx, './Art/2D/female2_spritesheet.png');
const floorHeight = player.y + player.H;
// const block = new Block(canvas.width, floorHeight - 80, 40, 80, 50, ctx);

const blockArray = [];
const blockArrayI = 0;
let blockSpeed = 20;
addBlock();
let playerInput = false;
let jumping = false;
const jumpPower = 25;
const jumpDuration = 8;
let jumpCounter = 0;
const gravity = 20;
let jumpingMultiplier = 1;
const falling = false;
const isJumping = false;

let numberOfBlocksPassed = 0;
let increasedDif = false;
console.log(floorHeight);

const randomAmountOfTimeForSpawn = 20;
let maxAmountForRandomSpawn = 30;
let randomSpawn = 0;
let counterForSpawn = 0;

// addBlock();
setInterval(gameLoop, 33);
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = 'rgb(0,0,0)';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = 'rgb(0,0,200)';
  // ctx.fillRect(0, floorHeight, canvas.width, 20);

  ctx.drawImage(scene.background, ctx.canvas.width / 2 - 1600 / 2, ctx.canvas.height / 2 - 720 / 2);
  ctx.drawImage(scene.ground, ctx.canvas.width / 2 - 1032 / 2, floorHeight);

  /*
   */
  if (counterForSpawn >= randomSpawn) {
    console.log('spawn');
    randomSpawn = Math.floor(Math.random() * maxAmountForRandomSpawn + 20);
    counterForSpawn = 0;
    addBlock();
  } else {
    counterForSpawn++;
  }
  /*
   */
  for (let x = 0; x < blockArray.length; x++) {
    if (!blockArray[x].update()) {
      increasedDif = false;
      numberOfBlocksPassed++;
      blockArray.shift();
    }
    blockArray[x].draw();
    if (
      player.x + player.W >= blockArray[x].x
      && player.x <= blockArray[x].x + blockArray[x].w
      && player.y + player.H >= blockArray[x].y
    ) {
      console.log('collision');
    }
  }
  if (numberOfBlocksPassed % 5 == 0 && !increasedDif) {
    console.log('increased speed');
    maxAmountForRandomSpawn -= 2;
    blockSpeed += 3;
    increasedDif = true;
  }
  /*
   */
  if (jumping) {
    /*
     */
    jumpCounter++;
    // console.log(jumpCounter + " jumpCounter");
    if (jumpCounter >= jumpDuration) {
      // console.log("jumping is false;");
      // console.log(jumping);
      if (player.y + player.H <= floorHeight - gravity) {
        // console.log("gravity");
        player.y += gravity;
      } else {
        player.y = floorHeight - player.H;
        jumping = false;
      }
    } else {
      player.y -= jumpPower * jumpingMultiplier;
      jumpingMultiplier *= 0.9;
    }
  }
  /*
   */
  player.draw();
  // Draw foreground.
  ctx.drawImage(scene.foreground, ctx.canvas.width / 2 - 1600 / 2, ctx.canvas.height / 2 - 720 / 2);
}

function addBlock() {
  console.log(blockArray);
  const randomHeight = Math.floor(Math.random() * 40 + 40);
  blockArray.push(
    new Block(
      canvas.width,
      floorHeight - randomHeight,
      40,
      randomHeight,
      blockSpeed,
      blockArray,
      ctx,
    ),
  );
}

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
      if (!jumping) {
        // console.log("can jump");
        jumping = true;
        jumpCounter = 0;
        jumpingMultiplier = 1;
      } else {
        console.log('not alloud to jump');
      }
      break;
    default:
  }
});
document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
    case 'ArrowUp':
      playerInput = false;
      break;
    default:
  }
});
