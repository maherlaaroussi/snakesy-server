import Player from '../models/player.js';
import Map from '../models/map.js';
import Position from '../models/position.js';
import GameConfig from '../config/game.js';
import { ResponseCode } from '../config/server.js';

class Core {

    constructor() {
        this.map = new Map();
        this.playersList = [];
        this.deadPlayersList = [];
    }
    
    refreshGame() {
        this.killPlayersAtSameNewPosition();
        this.playersList.forEach(p => {
            this.movePlayer(p);
        });

        // Fruit's counter, at the end, a fruit spawn
        if(this.map.counterFruit > 0) this.map.counterFruit--;
        if(this.map.counterFruit == 0) this.map.generateFruit();

        // X . X
    }

    newGame() {
        this.map.init();
    }

    killPlayersAtSameNewPosition() {
        var playersNextPositions = [];

        this.playersList.forEach(p => {
            var newPosition = this.getNewPosition(p.snake[0], p.nextDirection);
            playersNextPositions.push([p, newPosition]);
        });

        playersNextPositions.forEach(p => {
            var ps = playersNextPositions.filter(p2 => p[1] === p2[1]);
            if (ps.length > 1) ps.forEach(player => this.dead(player[0]));
        });
    }

    newPlayer(name, socket) {
        if(this.isNameExist(name)) return ResponseCode.ERROR_NAME_ALREADY_EXIST;
        if(this.isSocketExist(socket)) return ResponseCode.ERROR_SOCKET_ALREADY_EXIST;
        var randomPosition = this.map.getRandomSpawn();
        var player = new Player(name, socket);
        player.snake.push(randomPosition);
        this.playersList.push(player);
        this.map.map[randomPosition.x][randomPosition.y] = GameConfig.keyMap.SNAKE; 
        return ResponseCode.ACCOUNT_CREATED;
    }

    getMap() {
        return this.map;
    }
    
    getPlayers() {
        return this.playersList;
    }

    isNameExist(name) {
        return this.playersList.some(p => p.name == name);
    }

    isSocketExist(socket) {
        return this.playersList.some(p => p.socket === socket);
    }

    getPlayer(socket) {
        return this.playersList.filter(p => p.socket == socket)[0];
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
            var s = this.map.map[j][i] == 0 ? '.' : (this.map.map[j][i] == 1 ? '*' : this.map.map[j][i] == 2 ? 'X' : (this.map.map[j][i] == 3 ? 'O' : '+'));
            line += (' '+s);
            //console.log(map[j][i]);
          }
          console.log(line);
        }
      }
    
    // Move one player.
    movePlayer(player) {
        // Remove player from map
        // TODO : gérer les déplacement mirroir (si le serpent se déplace en bas et qui faut haut, le serveur ne validera pas la position ou alors on dit qu'il se mange et il meurt)
        player.snake.forEach(position => this.map.map[position.x][position.y] = GameConfig.keyMap.EMPTY); // O(n)

        var head = player.snake[0];
        var newPosition = this.getNewPosition(head, player.nextDirection);

        // If there anything else than empty.
        if (!this.isValidMove(head, player.nextDirection)) {
            this.dead(player);
            return;
        }
        
        // If there is a fruit on the new position
        if(this.isFruitAtPosition(newPosition)) {
            this.eatFruit(player);
        }
        else {
            player.snake.unshift(newPosition);
            player.snake.pop();
        }

        // Reput player on the map
        player.snake.forEach(position => this.map.map[position.x][position.y] = GameConfig.keyMap.SNAKE);
    }

    dead(player) {
        this.alive = false;
        this.snake = [];
        this.deadPlayersList.push(player);
        const index = this.playersList.indexOf(player)
        this.playersList.splice(index, 1);
    }

    eatFruit(player) {
        player.snake.unshift(this.map.fruitCoordinate);
        player.score += GameConfig.FRUITSCORE;
        this.map.counterFruit = (Math.floor(Math.random() * ((GameConfig.DELAYMAX + 1) - GameConfig.DELAYMIN) + GameConfig.DELAYMIN)) / GameConfig.INTERVAL;
        this.map.fruitCoordinate = undefined;
    }

    // Check is a fruit is at this position.
    isFruitAtPosition(position) {
        return (this.map.getKeyMap(position) == GameConfig.keyMap.FRUIT);
    }

    isValidMove(position, direction) {
        var newPosition = this.getNewPosition(position, direction);
        return this.map.isEmptyPositionOrFruit(newPosition);
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

    // Get all informations
    getInformations() {
        var informations = {
            map: this.map,
            players: this.getPlayersWithoutSocket(this.playersList),
            deadPlayers: this.getPlayersWithoutSocket(this.deadPlayersList)
        };
        return informations;
    }
    
    getPlayersWithoutSocket(list) {
        //  TODO: use a deep copy.
        //  var copy = JSON.parse(JSON.stringify(obj));
        var newPlayersList = [...list];
        //Object.assign(newPlayersList, list); // Copy the list
        newPlayersList.forEach(p => {
            delete p.socket;
            delete p.nextDirection;
        });
        console.log(newPlayersList);
        console.log(this.playersList);
        return newPlayersList;
    }
}

export default Core;