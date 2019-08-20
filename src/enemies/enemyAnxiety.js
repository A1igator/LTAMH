const Enemy = require('./enemy');

module.exports = class EnemyAnxiety extends Enemy {
  constructor(x, y, dir, mapArray) {
    super(x, y, dir, mapArray);
    this.speed = 3.2;
    this.animationSpeed = 0.18;
    this.sprite.src = './Art/2D/enemy_anxiety_spritesheet.png';
    this.animationSize = 3;
  }
};
