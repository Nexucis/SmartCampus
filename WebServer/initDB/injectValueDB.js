function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function injectData(name,h,j){
    var dir = ["N","NE","E","SE","S","SO","O","NO"];
    var pression = getRandomInt(1000,1050);
    var temperature = getRandomInt(-10,30);
    var luminosite = getRandomInt(0,1500);
    var pluviometrie = getRandomInt(0,500);
    var directionVent = dir[getRandomInt(0,7)];
    var humidite = getRandomInt(0,100);
    var vitesseVent = getRandomInt(0,100);
    var date = new Date(2015,3,1+j,h,0,0);
    
    var data = new SensorsWirelessDataModel({
            name:name,
            temperature:temperature,
            pression:pression,
            luminosite:luminosite,
            pluviometrie:pluviometrie,
            directionVent:directionVent,
            humidite:humidite,
            vitesseVent:vitesseVent,
            date:date
    });
    
    data.save(function (err){
        if(err){throw err;}
        console.log("add some data");
    });
}

function injectManyMesure(nbT,delay){
	var i = 0;
    var j = 0;
    var k = 0;
	while (nbT > 0){
		//setTimeout est non blocant
		setTimeout(function(){
            console.log("i"+i);
            i++;
        if((i%24) ===0){
            j++;
        }
            injectData(1,i%24,j);
        }, delay*k);
        nbT--;
		k++;
	}
	setTimeout(stopDB, delay*k);
}

function stopDB(){
	mongoose.connection.close();
	console.log('connection with db is closed');
}


function main(){
	var addrmongo = 'mongodb://localhost/Client';

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
	var routes = require('./../routes');

	includeInThisContext(__dirname + "/model.js");


	mongoose.connect(addrmongo, function(err) {
  	if (err) { throw err; }
	});

	console.log('connection is successed with db');
//injection de valeur de température
	var nbT = 200;
	var delay = 5000;
	injectManyMesure(nbT,delay);
}


main();


