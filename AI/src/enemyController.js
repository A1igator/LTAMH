const EnemyAnxiety = require('./enemies/enemyAnxiety');
const EnemyBPD = require('./enemies/enemyBPD');
const EnemyDepression = require('./enemies/enemyDepression');

module.exports = class EnemyController {
  constructor() {
    // this.spriteEnemyAnxiety = new Image();
    // this.spriteEnemyAnxiety.src = './Art/2D/enemy_anxiety_spritesheet.png';
    // this.spriteEnemyBPD = new Image();
    // this.spriteEnemyBPD.src = './Art/2D/enemy_borderline_personality_disorderanxiety_spritesheet.png';
    // this.spriteEnemyDepression = new Image();
    // this.spriteEnemyDepression = './Art/2D/enemy_depression_spritesheet.png';
    this.enemiesSpawned = 0;
    this.enemies = [];
  }

  // Spawn the enemies randomly.
  spawnEnemies(mapArray, gameObjects) {
    gameObjects.push(new EnemyBPD(
      1 * 128,
      1 * 128,
      (mapArray[1][1 - 1] === 1 && mapArray[1][1 + 1] === 1 ? 0 : 1),
      mapArray
    ));
    //   const chanceMax = 100;
    //   let chance = chanceMax;
    //   for (let y = 0; y < mapArray.length; y++) {
    //     for (let x = 0; x < mapArray[y].length; x++) {
    //       // Check for ground.
    //       const rand = Math.floor(Math.random() * chance);
    //       if (mapArray[x][y] === 0) {
    //         if (rand === 0) {
    //           switch (Math.floor(Math.random() * 3)) {
    //             case 0:

    //               break;
    //             case 1:
    //               gameObjects.push(new EnemyAnxiety(
    //                 x * 128,
    //                 y * 128,
    //                 (mapArray[x][y - 1] === 1 && mapArray[x][y + 1] === 1 ? 0 : 1),
    //                 mapArray
    //               ));
    //               break;
    //             case 2:
    //               gameObjects.push(new EnemyBPD(
    //                 x * 128,
    //                 y * 128,
    //                 (mapArray[x][y - 1] === 1 && mapArray[x][y + 1] === 1 ? 0 : 1),
    //                 mapArray
    //               ));
    //               break;
    //             default: break;
    //           }
    //           this.enemiesSpawned += 1;
    //           chance = chanceMax;
    //         }
    //         chance -= 1;
    //       }
    //     }
    //   }

    //   // Spawn at least one enemy.
    //   while (this.enemiesSpawned === 0) {
    //     const randX = Math.floor(Math.random() * (mapArray.length - 1));
    //     const randY = Math.floor(Math.random() * (mapArray.length - 1));
    //     if (mapArray[randX][randY] === 0) {
    //       switch (Math.floor(Math.random() * 3)) {
    //         case 0:
    //           gameObjects.push(new EnemyDepression(
    //             randX * 128,
    //             randY * 128,
    //             undefined, // (mapArray[randX][randY - 1] === 1 && mapArray[randX][randY + 1] === 1 ? 0 : 1),
    //             mapArray
    //           ));
    //           break;
    //         case 1:
    //           gameObjects.push(new EnemyAnxiety(
    //             randX * 128,
    //             randY * 128,
    //             undefined, // (mapArray[randX][randY - 1] === 1 && mapArray[randX][randY + 1] === 1 ? 0 : 1),
    //             mapArray
    //           ));
    //           break;
    //         case 2:
    //           gameObjects.push(new EnemyBPD(
    //             randX * 128,
    //             randY * 128,
    //             undefined, // (mapArray[randX][randY - 1] === 1 && mapArray[randX][randY + 1] === 1 ? 0 : 1),
    //             mapArray
    //           ));
    //           break;
    //         default: break;
    //       }
    //       this.enemiesSpawned += 1;
    //     }
    //   }
    // }
  };
}