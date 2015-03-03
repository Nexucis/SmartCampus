function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function injectTemperature(){
	var random = getRandomInt(-10,30);
	var degree = new MesureModel({
		value : random,
		unite : "C"
	});
	degree.save(function (err) {
  		if (err) { throw err; }
  		console.log('temperature : '+random+' °C is added !');
	});
}

function stopDB(){
	mongoose.connection.close();
	console.log('connection with db is closed');
}


function main(){
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
//injection de valeur de température
	var nbT = 10;
	var i = 0;
	var delay = 5000;
	while (nbT > 0){
		//setTimeout est non blocant
		setTimeout(injectTemperature, delay*i);
		i++;
		nbT--;
	}
	setTimeout(stopDB, delay*i);
	
}


main();


