module.exports = class MapPowerup {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 128;
    this.height = 128;
    this.sprite = new Image();
    this.sprite.src = './Art/2D/map_powerup_spritesheet.png';
    this.spriteIndex = 0;
    this.animationSpeed = 0.16;
    this.animationSize = 8;
  }

  update(dt) {
    this.spriteIndex = (this.spriteIndex + this.animationSpeed) % this.animationSize;
  }

  draw(ctx, worldPosX, worldPosY) {
    ctx.drawImage(
      this.sprite,
      this.width * Math.floor(this.spriteIndex),
      0,
      this.width,
      this.height,
      this.x - worldPosX,
      this.y - worldPosY,
      this.width,
      this.height
    );
  }
}