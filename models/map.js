import GameConfig from '../config/game.js';
import Position from './position.js';

class Map {

    constructor(width, height) {
        this.map = new Array();
        this.width = GameConfig.WIDTH;
        this.height = GameConfig.HEIGHT;
        this.counterFruit = undefined;
        this.fruitCoordinate = undefined;
    }

    init() {
        this.generateMap(this.width, this.height);
        this.generateFruit();
    }

    // Generate the map
    generateMap(width, height) 
    {
        this.map = new Array(width);
        for (var i = 0; i < width; i++)
        {
            this.map[i] = new Array(height);
            for(var j = 0; j < height; j++) 
            {    
                if(i == 0 || i == width-1) {
                    this.map[i][j] = GameConfig.keyMap.WALL;
                } else if (j == 0 || j == height-1) {
                    this.map[i][j] = GameConfig.keyMap.WALL;
                } else {
                    this.map[i][j] = GameConfig.keyMap.EMPTY;
                }
            }
        }       
    }

    // Generate randomly the first fruit
    generateFruit() {
        if(this.fruitCoordinate) this.map[this.fruitCoordinate.x][this.fruitCoordinate.y] = GameConfig.keyMap.EMPTY;
        this.fruitCoordinate = this.getRandomEmptyPosition();
        this.counterFruit = -1;
        this.map[this.fruitCoordinate.x][this.fruitCoordinate.y] = GameConfig.keyMap.FRUIT;
        this.counterFruit = undefined;
    }

    isFruit() {
        if(!this.fruitCoordinate) return false;
        return true;
    }

    getEmptyPositions() {
        var positions = [];
        var x = 0;
        var y = 0;

        this.map.forEach(c => {
            c.forEach(v => {
                if(v == GameConfig.keyMap.EMPTY) {
                    positions.push(new Position(x, y));
                }
                y++;
            })
            x++;
            y = 0;
        });

        return positions;
    }

    isEmptyPosition(position) {
        return this.getEmptyPositions().some(e => e.isEqual(position));     
    }

    isEmptyPositionOrFruit(position) {
        return this.getEmptyPositions().some(e => e.isEqual(position) || this.map[position.x][position.y] == GameConfig.keyMap.FRUIT);
    }

    getKeyMap(position) {
        return this.map[position.x][position.y];
    }

    // Positions with a space of 1 with walls
    getEmptyPositionsWithSpaceWithWalls() {
        var emptyPositions = this.getEmptyPositions();
        var res = emptyPositions.filter(p => (((GameConfig.WIDTH - 3) >= p.x) && ((GameConfig.HEIGHT - 3) >= p.y)) && ((2 <= p.x) && (2 <= p.y)));
        return res;
    }

    getRandomSpawn() {
        // TODO: Prendre en compte la positoins des snakes, donc dépalcer ces fonctions dans CORE
        var positions = this.getEmptyPositionsWithSpaceWithWalls();
        var rand = Math.floor(Math.random() * (positions.length - 1));
        return positions[rand];
    }

    getRandomEmptyPosition() {
        // TODO: Ne pas prendre en compte la position des snakes des joueurs
        var positions = this.getEmptyPositions();
        var rand = Math.floor(Math.random() * (positions.length - 1));
        return positions[rand];
    }

}
export default Map;