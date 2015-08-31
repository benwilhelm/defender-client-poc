var Contrib = require('blessed-contrib');

module.exports = {
    getWidget: function() {
        return Contrib.log({
            fg: "green",
            label: "Guesses",
            height: 25,
            width: 20, 
            left: 0,
            top : 0,
            
            border: {
                type: "line",
            }
        })
    }
}
