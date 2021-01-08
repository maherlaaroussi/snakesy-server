import Map from '../models/map.js';
import { io } from 'socket.io-client';
import ServerConfig from '../config/server.js';
import { ResponseCode } from '../config/server.js';
// ----------------------------------------------
class TestMap {

    constructor() {
        var map = new Map(32, 24);
        map.init();
        this.run();
    }

    run() {
        testNumb();
    }

    testNumb() {
        for (var i = 0; i < 10000; i++) {
            var p = Math.floor(Math.random() * (32 - 2) + 1);
            if(p == 30) {
                console.log(p);
            }
        }
    }
}

// ----------------------------------------------

class TestClient {

    constructor() {
        this.run(1);
    }

    async run(playersNumber = 1) {

        var moveList = ['up','down','left','right'];
        
        for (var i = 0; i < playersNumber; i++) {
            const socket = io('ws://localhost:' + ServerConfig.PORT);
            // Connect is just to verify if the socket is connected to server.
            socket.on('connect', () => {
                console.log('Connected with id: ' + socket.id);
            });

            socket.on('refresh-map', data => {
                //console.log(data);
            });

            socket.on('players', data => {
                //console.log(data);
            });

            socket.on('player-created', () => {
                console.log('Player created. ' + socket.id);
            });

            socket.on('message', data => {
                if(data == ResponseCode.ERROR_NAME_ALREADY_EXIST) console.log('Name already exist!');
                if(data == ResponseCode.ERROR_SOCKET_ALREADY_EXIST) console.log('Socket already exist!');
            });

            socket.emit('new-player', 'Player' + (i));
            socket.emit('new-player', 'Beta');

            var rand = Math.floor(Math.random() * (4 - 1)); 
            var direction = moveList[rand];
            socket.emit('move', direction);

            await this.sleep(1000);
        } 
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }   

}

//var server = new Server();
var testClient = new TestClient();