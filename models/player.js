import GameConfig from '../config/game.js';

class Player {
    constructor(name, socket) {
      this.name = name;
      this.nextDirection = GameConfig.DIRECTIONDEFAULT;
      this.snake = [];
      this.score = 0;
      this.socket = socket;
      this.alive = true;
    }

    getNextDirection() {
      return this.nextDirection;
    }

    setNextDirection(direction) {
      this.nextDirection = direction;
    }

    getSnake() {
      return this.snake;
    }

    getInformations() {
      return {
        name : this.name,
        snake: this.snake,
        score: this.score   
      };
    }

}

export default Player;