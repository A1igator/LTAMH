module.exports = class Teleporter {
  constructor(x, y, id) {
    this.id = id;
    this.disabled = false;
    this.performTask = undefined; // Will equal undefined or setTimeout to delay usage;
    this.x = x;
    this.y = y;
    this.width = 128;
    this.height = 128;
    this.sprite = new Image();
    this.sprite.src = './Art/2D/teleporter_spritesheet.png';
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

  delay() {
    this.disabled = true;
    setTimeout(() => {
      this.disabled = false;
    }, 1000);
  }

  setOtherTeleporter(otherTeleporter) {
    this.otherTeleporter = otherTeleporter;
  }
}

