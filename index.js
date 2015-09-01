#!/usr/bin/env node

var Blessed = require('blessed');
var Contrib = require("blessed-contrib");
var uiMap = require("./ui/map");
var uiInput = require("./ui/input");
var uiTimer = require("./ui/timer");
var uiGuesses = require("./ui/log");
var _ = require('lodash');
var arc = require('arc');

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
var chi = {
    lat: 42,
    lon: -88
}

var mos = {
    lat: 55,
    lon: 37
}

var generator = new arc.GreatCircle({
    x: mos.lon,
    y: mos.lat
}, {
    x: chi.lon,
    y: chi.lat
}, {
    name: "Moscow to Chicago"
})
var trajectory = generator.Arc(20);
_.each(trajectory.geometries[0].coords, function(coord){
    map.addMarker({lon: coord[0], lat: coord[1], color: "red", char: '*'});
})
map.addMarker({"lon" : chi.lon, "lat" : chi.lat, color: "red", char: "x" })
map.addMarker({"lon" : mos.lon, "lat" : mos.lat, color: "red", char: "x" })


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
    var prefix = Math.random() < 0.2 ? "* " : "  ";
    guessLog.log(prefix + message);
    this.clearValue();
    screen.render();
})


screen.render();
input.focus();
