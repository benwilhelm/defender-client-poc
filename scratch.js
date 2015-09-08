#! /usr/bin/env node

var readline = require('readline');
var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var io = sailsIOClient(socketIOClient);
io.sails.url = 'http://localhost:1337';

var rl = readline.createInterface(process.stdin, process.stdout);


var whoami;

io.socket.on("connect", function(){
    setTimeout(function(){
        io.socket.get('/icbms/', function serverResponded (body, JWR) {
            clear();
            console_out(body);

            io.socket.on('icbm', function(obj){
                console_out(obj.data.eventType);
            })
        });
    }, 100);
})

rl.on('line', function (line) {
  // io.socket.post('/terminal/broadcast', {
  //   from: whoami,
  //   message: line
  // });
  rl.prompt(true);
});

function console_out(msg){
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(msg);
  rl.prompt(true);
}

function clear() {
  console_out('\033[2J');
}
