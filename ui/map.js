var _ = require("lodash");
var Blessed = require('blessed');
var Contrib = require("blessed-contrib");
var InnerMap = require("blessed-contrib/node_modules/map-canvas");

InnerMap.prototype.getMapData_rus = function() {
    var rusData = require("../data/russia.json");
    var usData = require("../data/usa.json")

    var geometry = _.union(rusData, usData);

    return { shapes: geometry }
}

module.exports = {
    generate: function(screen) {

        var map = new Contrib.map({
            top: 0,
            left: 20,
            label: "",
            width: screen.width - 20,
            height: screen.height - 10,
            startLon: 0,
            startLat: 90,
            disableGraticule: false,
            disableBackground: false,
            disableMapBackground: false,
            disableFill: false,
            // endLon: 112,
            // endLat: 140,
            region: 'rus',

            style: {
                // fill: "red",
                shapeColor: "green",
                // fg: "red",
                bg: "black"
            }
        });
        
        return map
    }
};
