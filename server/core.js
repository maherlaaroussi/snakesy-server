import Player from '../models/player.js';
import Map from '../models/map.js';
import Position from '../models/position.js';
import GameConfig from '../config/game.js'

var map = new Map();
var playersList = [];
//var deadPlayersList = [];

class Core {

    constructor() {}
    
    refreshGame() {

        // TODO: tester l'hypothèse de la suppression et de l'ajout du joueur dans la carte pour le problème du X -> XX -> X.
        // TODO: mettre les variables (privées ?) dans la classe et pas à l'extérieur

        playersList.forEach(p => {
            this.movePlayer(p);
        });

        // Fruit's counter, at the end, a fruit spawn
        if(map.counterFruit > 0) map.counterFruit--;
        if(map.counterFruit == 0) map.generateFruit();

    }

    newGame() {
        map.init();
    }

    newPlayer(name, socket) {
        if (!this.isNameExist(name)) {
            var randomPosition = map.getRandomSpawn();
            var player = new Player(name, socket);
            player.snake.push(randomPosition);
            player.snake.push(new Position(randomPosition.x - 1, randomPosition.y)); 
            playersList.push(player);
            map.map[randomPosition.x][randomPosition.y] = GameConfig.keyMap.SNAKE;
            map.map[randomPosition.x - 1][randomPosition.y] = GameConfig.keyMap.SNAKE;
        }
    }

    getMap() {
        return map;
    }
    
    getPlayers() {
        return playersList;
    }

    isNameExist(name) {
        return playersList.some(p => p.name == name);
    }

    getPlayer(socket) {
        return playersList.filter(p => p.socket == socket)[0];
    }

    isValidDirection(direction) {
        return Object.values(GameConfig.DIRECTIONS).includes(direction);
    }

    showMap() {
        console.log("===================");
        var line = '';
        for (var i = GameConfig.HEIGHT - 1; i >= 0; i--) {
          line = '';
          for (var j = 0; j < GameConfig.WIDTH; j++) {
            var s = map.map[j][i] == 0 ? '.' : (map.map[j][i] == 1 ? '*' : map.map[j][i] == 2 ? 'X' : (map.map[j][i] == 3 ? 'O' : '+'));
            line += (' '+s);
            //console.log(map[j][i]);
          }
          console.log(line);
        }
      }
    
    // Move one player.
    movePlayer(player) {
        // Remove player from map
        player.snake.forEach(position => map.map[position.x][position.y] = GameConfig.keyMap.EMPTY); // O(n)

        var head = player.snake[0];
        var newPosition = this.getNewPosition(head, player.nextDirection);

        // If there anything else than empty.
        if (!this.isValidMove(head, player.nextDirection)) {
            this.dead(player);
            return;
        }
        
        // If there is a fruit on the new position
        if(this.isFruitAtPosition(newPosition)) {
            this.eatFruit(player, newPosition);
        }
        else {
            player.snake.unshift(newPosition);
            player.snake.pop();
        }
         
        // Reput player on the map
        player.snake.forEach(position => map.map[position.x][position.y] = GameConfig.keyMap.SNAKE);
    }

    dead(player) {
        this.alive = false;
        this.snake = [];
        deadPlayersList.push(player);
        const index = playersList.indexOf(player)
        playersList.splice(index, 1);
      }
    eatFruit(player, newPosition) {
        player.snake.unshift(newPosition);
        player.score += GameConfig.FRUITSCORE;
        map.map[map.fruitCoordinate.x][map.fruitCoordinate.y] = GameConfig.keyMap.SNAKE;
        map.counterFruit = (Math.floor(Math.random() * (GameConfig.DELAYMAX - GameConfig.DELAYMIN) + GameConfig.DELAYMIN)) / GameConfig.INTERVAL;
    }

    // Check is a fruit is at this position.
    isFruitAtPosition(position) {
        return (map.getKeyMap(position) == GameConfig.keyMap.FRUIT);
    }

    isValidMove(position, direction) {
        var newPosition = this.getNewPosition(position, direction);
        return map.isEmptyPositionOrFruit(newPosition);
    }

    getNewPosition(position, direction) {
        var newPosition = null;
        switch (direction) {
            case GameConfig.DIRECTIONS.RIGHT :
                newPosition = new Position(position.x + 1, position.y);
                break;
            case GameConfig.DIRECTIONS.LEFT :
                newPosition = new Position(position.x - 1, position.y);
                break;
            case GameConfig.DIRECTIONS.UP:
                newPosition = new Position(position.x, position.y + 1);
                break;
            case GameConfig.DIRECTIONS.DOWN:
                newPosition = new Position(position.x, position.y - 1);
                break;
        }
        return newPosition;
    }

    // Save next direction
    saveMove(direction, socket) {
        if(!this.isValidDirection(direction)) return;
        var p = this.getPlayer(socket);
        if(p) p.setNextDirection(direction);
    }
}

export default Core;