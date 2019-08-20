module.exports = class Key {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = new Image();
    this.sprite.src = './Art/2D/key_spritesheet.png';
    this.width = 128;
    this.height = 128;
    this.spriteIndex = 0;
    this.animationSpeed = 0.12;
    this.animationSize = 8;
  }

  update() {
    this.spriteIndex = (this.spriteIndex + this.animationSpeed) % this.animationSize;
  }

  draw(ctx, worldPosX, worldPosY) {
    ctx.drawImage(
      this.sprite,
      Math.floor(this.spriteIndex) * this.width,
      0,
      this.width,
      this.height,
      this.x - worldPosX,
      this.y - worldPosY,
      this.width,
      this.height,
    );
  }
}