const Enemy = require('./enemy');

module.exports = class EnemyBPD extends Enemy {
  constructor(x, y, dir, mapArray) {
    super(x, y, dir, mapArray);
    this.speed = 2.4;
    this.animationSpeed = 0.1;
    this.sprite.src = './Art/2D/enemy_borderline_personality_disorder_spritesheet.png';
    this.animationSize = 4;
  }
};
