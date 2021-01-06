import Map from '../models/map.js';
import { io } from 'socket.io-client';
import ServerConfig from '../config/server.js';
// ----------------------------------------------
class TestMap {

    constructor() {
        var map = new Map(32, 24);
        map.init();
        this.run()
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
        this.run(5);
    }

    async run(playersNumber = 1) {

        for (var i = 0; i < playersNumber; i++) {
            const socket = io('ws://localhost:' + ServerConfig.PORT);
            // Connect is just to verify if the socket is connected to server.
            socket.on('connect', () => {
                console.log('Connected with server.');
            });

            socket.on('refresh-map', data => {
                console.log(data);
            });

            socket.on('players', data => {
                console.log(data);
            });

            socket.emit('new-player', 'Player' + (i));
            socket.emit('move','down');

            await this.sleep(6000);
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