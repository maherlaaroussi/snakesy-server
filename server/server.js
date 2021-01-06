import ServerConfig from '../config/server.js';
import GameConfig from '../config/game.js';
import * as socketio from 'socket.io';
import Core from './core.js';

class Server {
  
  constructor() {
    this.core = new Core();
    this.io = new socketio.Server(ServerConfig.PORT);
    this.isGame = false;
  }
  
  run() {
    // Create the new game
    if(!this.isGame) {
      this.isGame = true;
      console.log('New game.');
      this.core.newGame();
      setInterval(this.refresh.bind(this), GameConfig.INTERVAL * 1000);
    }

    // Connection is important for server-side, we must put all stuffs here.
    this.io.on('connection', socket => {
        socket.on('new-player', name => {
          console.log('New player: ' + name);
          this.core.newPlayer(name, socket);
        });

        socket.on('move', direction => {
          console.log('Receive: '+ direction);
          core.saveMove(direction, socket);
        });
    });
  }

  refresh() {
    this.core.getPlayers().forEach(p => io.emit('players', p.snake));
    this.core.showMap();
    this.core.refreshGame();
  }
}

export default Server;