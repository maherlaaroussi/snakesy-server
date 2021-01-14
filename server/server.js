import GameConfig from '../config/game.js';
import * as socketio from 'socket.io';
import Game from '../core/game.js';
import { ResponseCode, ServerConfig } from '../config/server.js';

class Server {
  constructor() {
    this.game = new Game();
    this.io = new socketio.Server(ServerConfig.PORT);
    this.isGame = false;
  }
  
  run() {
    // Create the new game
    if(!this.isGame) {
      this.isGame = true;
      console.log('Server started at ws://localhost:' + ServerConfig.PORT + '.');
      this.game.newGame();
      setInterval(this.refresh.bind(this), GameConfig.INTERVAL * 1000);
    }

    // Connection is important for server-side, we must put all stuffs here.
    this.io.on('connection', socket => {

      // TODO: Send configuration of map to client.
      
      socket.on('new-player', name => {
        //console.log('New player: ' + name);
        var codeAnswer = this.game.newPlayer(name, socket);
        if(codeAnswer == ResponseCode.ACCOUNT_CREATED) {
          socket.emit('player-created');
          console.log(name + ' has joined the game.');
        }
        else socket.emit('message', codeAnswer);
      });

      socket.on('move', direction => {
        //console.log('Receive: '+ direction);
        this.game.saveMove(direction, socket);
      });

    });
  }

  refresh() {
    //this.game.getPlayers().forEach(p => this.io.emit('players', p.snake));
    //this.game.showMap();
    //this.game.getPlayers().forEach(p => this.io.emit('refresh-map', p.snake));
    this.game.refreshGame();
    this.io.emit('refresh-map', JSON.stringify(this.game.getInformations()));
    this.game.getPlayers().forEach(p => {
      p.socket.emit('my-player', p.getInformations());
    });
  }
}

export default Server;