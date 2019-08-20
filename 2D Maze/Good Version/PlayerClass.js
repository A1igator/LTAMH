class Player {
  constructor(x, y, w, h, ctx) {
    this.x = x;
    this.y = y;
    this.H = h;
    this.W = w;
    this.ctx = ctx;
    this.sprite = new Image();
    this.sprite.src = './Art/2D/female2_spritesheet.png';
    this.spriteIndex = 0;
    this.animationSize = 8;
    this.animationSpeed = 0.54;
  }

  draw() {
    // this.ctx.fillStyle = 'rgb(255,255,255)';
    // this.ctx.fillRect(this.x, this.y, this.W, this.H);
    this.spriteIndex = (this.spriteIndex + this.animationSpeed) % this.animationSize;
    this.ctx.drawImage(
      this.sprite,
      128 * Math.floor(this.spriteIndex),
      128,
      128,
      128,
      this.x,
      this.y - 40,
      128,
      128,
    );
  }
}
