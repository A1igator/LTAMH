// Load the sprite sheets.
const spriteEnemyAnxiety = new Image();
spriteEnemyAnxiety.src = '../../Art/2D/enemy_anxiety_spritesheet.png';
const spriteEnemyBPD = new Image();
spriteEnemyBPD.src = '../../Art/2D/enemy_borderline_personality_disorderanxiety_spritesheet.png';
const spriteEnemyDepression = new Image();
spriteEnemyDepression.src = '../../Art/2D/enemy_depression_spritesheet.png';

class EnemyController {
  constructor() {
    // this.spriteEnemyAnxiety = new Image();
    // this.spriteEnemyAnxiety.src = '../../Art/2D/enemy_anxiety_spritesheet.png';
    // this.spriteEnemyBPD = new Image();
    // this.spriteEnemyBPD.src = '../../Art/2D/enemy_borderline_personality_disorderanxiety_spritesheet.png';
    // this.spriteEnemyDepression = new Image();
    // this.spriteEnemyDepression = '../../Art/2D/enemy_depression_spritesheet.png';
    this.enemies = [];
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 128;
    this.height = 128;
    this.xDir = 0;
    this.yDir = 0;
    this.speed = 0;
    this.hSpeed = 0;
    this.vSpeed = 0;
    this.spriteIndexX = 0;
    this.spriteIndexY = 1;
    this.animationSpeed = 0;
  }

  update() {
    return;
  }

  draw(ctx) {
    return;
  }
}

class EnemyAnxiety extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.speed = 220;
    this.xDir = 1;
    this.animationSpeed = 0.18;
    this.sprite = spriteEnemyAnxiety;
    this.animationSize = 3;
  }

  update(dt) {

    this.hSpeed = this.speed * this.xDir * dt;
    this.vSpeed = this.speed * this.yDir * dt;
    this.x += this.hSpeed;
    this.y += this.vSpeed;

    this.spriteIndexX = (this.spriteIndexX + this.animationSpeed) % this.animationSize;

    if (this.xDir !== 0) {
      this.spriteIndexY = this.xDir === 1 ? 1 : 3;
    }
  }

  draw(ctx, worldPosX, worldPosY) {
    ctx.drawImage(
      this.sprite,
      this.width * Math.floor(this.spriteIndexX),
      this.height * this.spriteIndexY,
      this.width,
      this.height,
      this.x - worldPosX,
      this.y - worldPosY,
      this.width,
      this.height,
    );
  }
}