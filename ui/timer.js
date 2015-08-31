var Blessed = require("blessed");
var Contrib = require('blessed-contrib');

module.secondsRemaining = 120;

module.lcd = {};

module.exports = {
    
    getWidget: function(screen) {
        var lcd = module.lcd = Contrib.lcd({ 
            width: 30,
            height: 8,
            right: 0,
            bottom: 5,
            label: "Time to Impact",
            segmentWidth: 0.06, // how wide are the segments in % so 50% = 0.5
            segmentInterval: 0.08, // spacing between the segments in % so 50% = 0.550% = 0.5
            strokeWidth: 0.25, // spacing between the segments in % so 50% = 0.5
            elements: 4, // how many elements in the display. or how many characters can be displayed.
            display: "-:--", // what should be displayed before first call to setDisplay
            elementSpacing: 4, // spacing between each element
            elementPadding: 2, // how far away from the edges to put the elements
            color: 'white', // color for the segments
            border: {
                type: "line"
            },
            style: {
                bg: "black"
            }
        })
        
        return lcd;
    },
    
    start: function() {
        var timeRemaining = getTime(module.secondsRemaining)
        module.lcd.setDisplay(timeRemaining);
        
        if (module.secondsRemaining > 0) {
            module.secondsRemaining--;
            setTimeout(module.exports.start, 1000);
        }
    }
}

function getTime(secondsRemaining) {
    var min = Math.floor(secondsRemaining / 60).toString();
    var sec = (secondsRemaining % 60).toString();
    if (sec.length === 1) { 
        sec = "0" + sec;
    }
    
    divider = sec % 2 ? ":" : " "
    return min + divider + sec;
}
