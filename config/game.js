// Global variables

const DIRECTIONS = {
    RIGHT: 'right',
    LEFT: 'left',
    UP: 'up',
    DOWN: 'down'
};

const GameConfig = {
    WIDTH: 16,
    HEIGHT: 16,
    keyMap: {
        EMPTY: 0,
        WALL: 1,
        SNAKE: 2,
        FRUIT: 3
    },
    INTERVAL: 1, // seconds
    DIRECTIONS: DIRECTIONS,
    DIRECTIONDEFAULT: DIRECTIONS.RIGHT,
    FRUITSCORE: 10,
    DELAYMAX: 3,
    DELAYMIN: 1,
};

export default GameConfig;