var addrmongo = 'mongodb://localhost/test';

var fs = require("fs");

mongoose = require('mongoose'),
        extend = require('mongoose-schema-extend'),
        path = require("path"),
        mqtt = require('mqtt'),
        Schema = mongoose.Schema,
        restify = require('express-restify-mongoose');
var mers = require('mers');
var vm = require('vm');

var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
var routes = require('./routes');

includeInThisContext(__dirname + "/model.js");


mongoose.connect(addrmongo, function(err) {
  if (err) { throw err; }
});

console.log('connection is successed with db');

//initialisation de la bdd
//initialisation des capteurs

var sensors = new Sensors_dataModel({ 
	type: "humidite",
        identifiant: "captor1" 
});

sensors.save(function (err) {
  if (err) { throw err; }
  console.log('captor1 add with success !');
//mongoose.connection.close();
//console.log('connection with db is closed');
});

sensors = new Sensors_dataModel({ 
	type: "humidite",
	identifiant: "RUFramboisierehumidite"
});

sensors.save(function (err) {
  if (err) { throw err; }
  console.log('RUFranboise add with success !');
});
