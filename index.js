#!/usr/bin/env node

var Blessed = require('blessed');
var Contrib = require("blessed-contrib");
var uiMap = require("./ui/map");
var uiInput = require("./ui/input");
var uiTimer = require("./ui/timer");
var uiGuesses = require("./ui/log");
var _ = require('lodash');

var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var io = sailsIOClient(socketIOClient);
io.sails.url = 'http://localhost:1337';


var screen = Blessed.screen({
    smartCSR: true,
    useBCE: true,
    cursor: {
        artificial: true,
        blink: true,
        shape: "underline"
    },
    log: __dirname + "/application.log",
    debug: true,
    dockBorders: true
})

screen.title = 'Defender HQ';


var input = uiInput.generate(screen);
screen.append(input);

var map = uiMap.generate(screen)
screen.append(map);
map.ctx.save();

io.socket.get("/icbms", function(err, res) {
    _.each(res.body, function(icbm){
        // console.log(icbm);
        map.addMarker({
            lat: icbm.origin.lat,
            lon: icbm.origin.lon,
            char: '.',
            color: 'white'
        })
    })

    // TODO - abstract this spaghetti
    io.socket.on('icbm', function(event) {
        if (event.verb === 'updated') {
            
            var icbm = event.data;
            if (icbm.eventType === 'launch') {
                map.addMarker({
                    lat: icbm.origin.lat,
                    lon: icbm.origin.lon,
                    char: 'x'
                });
                map.ctx.save();
            }
            
            if (icbm.eventType === 'advance') {
                var pathToDate = icbm.trajectory.slice(0, icbm.trajectoryPoint);

                map.ctx.beginPath();
                _.each(pathToDate, function(coord, idx){
                    if (idx > 3) {
                        var x = map.innerMap.degreesOfLongitudeToScreenX(coord[0])
                        var y = map.innerMap.degreesOfLatitudeToScreenY(coord[1])
                        map.ctx.lineTo(x, y);
                    }
                })
                map.ctx.stroke();                
            }
            
            if (icbm.eventType === 'impact') {
                
                setTimeout(function(){
                    map.addMarker({
                        lat: icbm.target.lat,
                        lon: icbm.origin.lon,
                        char: "O",
                        color: 'red'
                    })
                }, 1000)
            }
        }
    })
})

// var trajectory = generator.Arc(50);

var timerWidget = uiTimer.getWidget(screen);
screen.append(timerWidget);
uiTimer.start(io);


var guessLog = uiGuesses.getWidget(screen);
screen.append(guessLog);

screen.key(['q', 'C-c'], function(ch, key){
    process.exit(0);
})

screen.key(['escape', 'i'], function() {
    input.focus();
})

input.key('enter', function(ch, key) {
    var message = this.getValue();

    if (message === 'render') {
        screen.render();
        return;
    }

    var prefix = Math.random() < 0.2 ? "* " : "  ";
    guessLog.log(prefix + message);
    this.clearValue();
})


io.socket.on("connect", function(){
    clear();
    screen.render();
    input.focus();
});


function clear() {
  console.log('\033[2J');
}
