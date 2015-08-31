#!/usr/bin/env node

var root = __dirname + "/.."
var input = root + "/data/RUS.geo.json"
var output = root + "/data/russia.json"

var _ = require('lodash');
var fs = require("fs");

var geoJson = require(input);

var geom = geoJson.features[0].geometry.coordinates;

var newGeo = [];
_.each(geom, function(shape){
    // bar = [];
    _.each(shape, function(foo){
        var llSet = [];
        _.each(foo, function(point){
            console.log(point);
            var ll = {
                lat: point[1].toString(),
                lon: point[0].toString()
            }
            llSet.push(ll);
        })
        newGeo.push(llSet);
    })
    // newGeo.push(bar);
});

fs.writeFile(output, JSON.stringify(newGeo), function(err){
    if (err) {
        return console.log(err);
    }

    console.log("Converted.")
})
