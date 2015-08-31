#!/usr/bin/env node

var Blessed = require('blessed');
var Contrib = require("blessed-contrib");
var uiMap = require("./ui/map");
var uiInput = require("./ui/input");
var uiTimer = require("./ui/timer");
var uiGuesses = require("./ui/log");
var _ = require('lodash');

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
map.addMarker({"lon" : "0", "lat" : "0", color: "red", char: "O" })
map.addMarker({"lon" : "-87", "lat" : "42", color: "red", char: "X" })


var timerWidget = uiTimer.getWidget(screen);
screen.append(timerWidget);
uiTimer.start();


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
    guessLog.log(message);
    this.clearValue();
    screen.render();
})


screen.render();
input.focus();
