// eslint-disable-next-line no-unused-vars
class PlayerCamera {
  constructor(ctx) {
    this.player = undefined;
    this.ctx = ctx;
    this.vWidth = ctx.canvas.width;
    this.vHeight = ctx.canvas.height;
    this.xDir = 0;
    this.yDir = 0;
    this.buffer = undefined;
  }

  attachTo(player) {
    this.player = player;
  }

  attachBuffer(buffer) {
    this.buffer = buffer;
  }

  update() {
    if (this.player !== undefined) {
      this.x = this.player.x - this.player.width / 2 - this.vWidth / 2;
      this.y = this.player.y - this.player.height / 2 - this.vHeight / 2;
    }
  }

  draw(worldPosX, worldPosY) {
    this.ctx.drawImage(
      this.buffer.canvas,
      worldPosX,
      worldPosY,
      this.vWidth,
      this.vHeight,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );
  }
}
