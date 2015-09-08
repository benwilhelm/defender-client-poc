var arc = require('arc');


function ICBM(options) {
    var self = this;
    self.origin = options.origin;
    self.endingPoint   = options.endingPoint;
    self.startingCity  = options.startingCity;
    self.endingCity    = options.endingCity;

    var generator = new arc.GreatCircle({
        x: self.startingPoint.lon,
        y: self.startingPoint.lat
    }, {
        x: self.endingPoint.lon,
        y: self.endingPoint.lat
    }, {
        name: self.startingCity + " -> " + self.endingCity;
    })
}

ICBM.prototype.plotTrajectory = function(map) {

}


module.exports = {
    newICBM: function(options) {
        return new ICBM(options);
    }
}
