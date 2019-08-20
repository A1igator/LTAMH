const Player = require('./PlayerClass');

module.exports = class Menu {
  constructor(switchBackTo2D, player) {
    this.menuMusic = new Audio('./mp3/rain.mp3');
    this.RADIUS = 50;
    this.circleDrawn = false;
    this.animateOp = 0;
    this.player = player;
    this.playerOp1 = new Player(
      canvas.width / 9 - 150,
      canvas.height / 3,
      300,
      300,
      ctx,
      './Art/2D/female1_spritesheet.png',
    );
    this.playerOp2 = new Player(
      canvas.width / 3 - 150,
      canvas.height / 3,
      300,
      300,
      ctx,
      './Art/2D/female2_spritesheet.png',
    );
    this.playerOp3 = new Player(
      (canvas.width / 9) * 8 - 150,
      canvas.height / 3,
      300,
      300,
      ctx,
      './Art/2D/male1_spritesheet.png',
    );
    this.playerOp4 = new Player(
      (canvas.width / 3) * 2 - 150,
      canvas.height / 3,
      300,
      300,
      ctx,
      './Art/2D/male2_spritesheet.png',
    );
    this.playerOp1.draw();
    this.playerOp2.draw();
    this.playerOp3.draw();
    this.playerOp4.draw();
    this.handleEvent = (e) => {
      switch (e.type) {
        case 'click':
          if (!this.circleDrawn) {
            if (
              Math.sqrt(
                (e.clientX - canvas.width / 2) * (e.clientX - canvas.width / 2)
                + (e.clientY - canvas.height / 2) * (e.clientY - canvas.height / 2),
              ) < this.RADIUS
            ) {
              canvas.removeEventListener('mousemove', this);
              canvas.style.cursor = 'auto';
              let timer = 0;

              const circleBigger = setInterval(() => {
                timer += 5;
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, timer, 0, 2 * Math.PI);
                ctx.fill();
                if (timer >= canvas.width / 1.5) {
                  clearInterval(circleBigger);
                  canvas.removeEventListener('click', this);

                  // setInterval(() => {
                  //   this.clearRect(0, 0, canvas.width, canvas.height);
                  //   this.playerOp1.draw();
                  // }, 210);
                  // ctx.clearRect(0, 0, canvas.width, canvas.height);
                  this.circleDrawn = true;

                  const startAnimation = () => {
                    // ctx.clearRect(0, 0, canvas.width, canvas.height);
                    this.playerOp1.draw();
                    this.playerOp2.draw();
                    this.playerOp3.draw();
                    this.playerOp4.draw();
                  };
                  requestAnimationFrame(startAnimation);

                  // requestAnimationFrame(this.animateOp1.bind(this));
                  canvas.addEventListener('mousemove', this);
                  canvas.addEventListener('click', this);
                  // const animate = () => {
                  //   if (this.animateOp)
                  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
                  //   switch (this.animateOp) {
                  //     case 1:
                  //       animateOp1();
                  //       break;
                  //     case 2:
                  //       this.playerOp2.draw();
                  //       break;
                  //     case 3:
                  //       this.playerOp3.draw();
                  //       break;
                  //     case 4:
                  //       this.playerOp4.draw();
                  //       break;
                  //   }
                  // };
                  // animate();
                  // this.menuMusic.pause();
                  // switchBackTo2D();
                  // console.log('test');
                }
              }, 20);
            }
          } else {
            if (
              e.clientX > canvas.width / 9 - 150
              && e.clientY > canvas.height / 3
              && e.clientX < canvas.width / 9 + 150
              && e.clientY < canvas.height / 3 + 300
            ) {
              console.log('player1 selected');
              this.player.setImage('./Art/2D/female1_spritesheet.png');
              this.animateOp = 0;
              switchBackTo2D();
              canvas.removeEventListener('mousemove', this);
              canvas.removeEventListener('click', this);
              canvas.style.cursor = 'auto';
              // canvas.style.cursor = 'pointer';
              // if (this.animateOp !== 1) {
              //   this.animateOp = 1;
              //   this.animateOp1();
              // }
            } else if (
              e.clientX > canvas.width / 3 - 150
              && e.clientY > canvas.height / 3
              && e.clientX < canvas.width / 3 + 150
              && e.clientY < canvas.height / 3 + 300
            ) {
              console.log('player2 selected');
              this.player.setImage('./Art/2D/female2_spritesheet.png');
              this.animateOp = 0;
              switchBackTo2D();
              canvas.removeEventListener('mousemove', this);
              canvas.removeEventListener('click', this);
              canvas.style.cursor = 'auto';
              // canvas.style.cursor = 'pointer';
              // if (this.animateOp !== 2) {
              //   this.animateOp = 2;
              //   this.animateOp2();
              // }
            } else if (
              e.clientX > (canvas.width / 9) * 8 - 150
              && e.clientY > canvas.height / 3
              && e.clientX < (canvas.width / 9) * 8 + 150
              && e.clientY < canvas.height / 3 + 300
            ) {
              console.log('player3 selected');
              this.player.setImage('./Art/2D/male1_spritesheet.png');
              this.animateOp = 0;
              switchBackTo2D();
              canvas.removeEventListener('mousemove', this);
              canvas.removeEventListener('click', this);
              canvas.style.cursor = 'auto';
              // canvas.style.cursor = 'pointer';
              // if (this.animateOp !== 3) {
              //   this.animateOp = 3;
              //   this.animateOp3();
              // }
            } else if (
              e.clientX > (canvas.width / 3) * 2 - 150
              && e.clientY > canvas.height / 3
              && e.clientX < (canvas.width / 3) * 2 + 150
              && e.clientY < canvas.height / 3 + 300
            ) {
              console.log('player4 selected');
              this.player.setImage('./Art/2D/male2_spritesheet.png');
              this.animateOp = 0;
              switchBackTo2D();
              canvas.removeEventListener('mousemove', this);
              canvas.removeEventListener('click', this);
              canvas.style.cursor = 'auto';
              // canvas.style.cursor = 'pointer';
              // if (this.animateOp !== 4) {
              //   this.animateOp = 4;
              //   this.animateOp4();
              // }
            }
          }
          break;
        case 'mousemove':
          if (!this.circleDrawn) {
            if (
              Math.sqrt(
                (e.clientX - canvas.width / 2) * (e.clientX - canvas.width / 2)
                + (e.clientY - canvas.height / 2) * (e.clientY - canvas.height / 2),
              ) < this.RADIUS
            ) {
              ctx.fillStyle = 'white';
              ctx.beginPath();
              ctx.arc(canvas.width / 2, canvas.height / 2, this.RADIUS - 1, 0, 2 * Math.PI);
              ctx.fill();
              canvas.style.cursor = 'pointer';
            } else {
              ctx.fillStyle = 'black';
              ctx.beginPath();
              ctx.arc(canvas.width / 2, canvas.height / 2, this.RADIUS - 1, 0, 2 * Math.PI);
              ctx.fill();
              canvas.style.cursor = 'auto';
            }
          } else {
            if (
              e.clientX > canvas.width / 9 - 150
              && e.clientY > canvas.height / 3
              && e.clientX < canvas.width / 9 + 150
              && e.clientY < canvas.height / 3 + 300
            ) {
              canvas.style.cursor = 'pointer';
              if (this.animateOp !== 1) {
                this.animateOp = 1;
                this.animateOp1();
              }
            } else if (
              e.clientX > canvas.width / 3 - 150
              && e.clientY > canvas.height / 3
              && e.clientX < canvas.width / 3 + 150
              && e.clientY < canvas.height / 3 + 300
            ) {
              canvas.style.cursor = 'pointer';
              if (this.animateOp !== 2) {
                this.animateOp = 2;
                this.animateOp2();
              }
            } else if (
              e.clientX > (canvas.width / 9) * 8 - 150
              && e.clientY > canvas.height / 3
              && e.clientX < (canvas.width / 9) * 8 + 150
              && e.clientY < canvas.height / 3 + 300
            ) {
              canvas.style.cursor = 'pointer';
              if (this.animateOp !== 3) {
                this.animateOp = 3;
                this.animateOp3();
              }
            } else if (
              e.clientX > (canvas.width / 3) * 2 - 150
              && e.clientY > canvas.height / 3
              && e.clientX < (canvas.width / 3) * 2 + 150
              && e.clientY < canvas.height / 3 + 300
            ) {
              canvas.style.cursor = 'pointer';
              if (this.animateOp !== 4) {
                this.animateOp = 4;
                this.animateOp4();
              }
            } else {
              canvas.style.cursor = 'auto';
              this.animateOp = 0;
            }
          }
          break;
        default:
          break;
      }
    };
  }

  animateOp1() {
    ctx.clearRect(canvas.width / 9 - 150, 0, 300, canvas.height);
    this.playerOp1.draw();
    if (this.animateOp === 1) {
      requestAnimationFrame(this.animateOp1.bind(this));
    } else {
      cancelAnimationFrame(this.animateOp1.bind(this));
    }
  }

  animateOp2() {
    ctx.clearRect(canvas.width / 3 - 150, 0, 300, canvas.height);
    this.playerOp2.draw();
    if (this.animateOp === 2) {
      requestAnimationFrame(this.animateOp2.bind(this));
    } else {
      cancelAnimationFrame(this.animateOp2.bind(this));
    }
  }

  animateOp3() {
    ctx.clearRect((canvas.width / 9) * 8 - 150, 0, 300, canvas.height);
    this.playerOp3.draw();
    if (this.animateOp === 3) {
      requestAnimationFrame(this.animateOp3.bind(this));
    } else {
      cancelAnimationFrame(this.animateOp3.bind(this));
    }
  }

  animateOp4() {
    ctx.clearRect((canvas.width / 3) * 2 - 150, 0, 300, canvas.height);
    this.playerOp4.draw();
    if (this.animateOp === 4) {
      requestAnimationFrame(this.animateOp4.bind(this));
    } else {
      cancelAnimationFrame(this.animateOp4.bind(this));
    }
  }

  // animate

  // handleMouseMove(e) {

  // }

  // handleMouseClick(e) {
  // }

  start() {
    this.menuMusic.play();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText("Let's talk about mental health!", canvas.width / 10, canvas.height / 3);
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, this.RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    canvas.addEventListener('mousemove', this);
    canvas.addEventListener('click', this);
  }
};
