function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function findIdLastMesureToAddToSensor(doc){
	//mettre 1 pour avoir le plus vieux
	MesureModel.findOne({}, {}, { sort: { 'date' : -1 } }, function(err, mesure) {
			var tabMesure = doc.mesure;
			tabMesure.push(mesure._id);
			doc.mesure = tabMesure;
  			doc.save();
			console.log("update sensor with some mesure");
		});
}

// on suppose que le nom du capteur est unique
function addMesureToSensor(name){
	Sensors_dataModel.findOne({identifiant: name }, 
		function (err, doc){
			if(err){
				throw(err);
			}
			if (doc === null){
				throw("error : sensor with name : " +name+" isn't found");
				
			}
			console.log("the sensor with name : "+name+" is found");

			findIdLastMesureToAddToSensor(doc);
			
			
  		}
	);

	
}

function addMesureToRandomSensor(){
	//liste des noms des capteurs --> ils doivent être uniques
	var tab = ["captor1","RUFramboisierehumidite","PolytechBureauDDhumidite","CROUSDortoirChambreMBairQualite"];
	var nameSensor =  tab[getRandomInt(0,4)];
	
	addMesureToSensor(nameSensor);
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
	addMesureToRandomSensor();
}

function injectPression(){
	var random = getRandomInt(1013,1015);
	var degree = new MesureModel({
		value : random,
		unite : "hPa"
	});
	degree.save(function (err) {
  		if (err) { throw err; }
  		console.log('pression : '+random+' hPa is added !');
	});
	addMesureToRandomSensor();
}

function injectManyMesure(nbT,delay){
	var i = 0;
	var tab = [injectPression,injectTemperature];
	while (nbT > 0){
		//setTimeout est non blocant
		setTimeout(tab[getRandomInt(0,2)], delay*i);
		i++;
		nbT--;
	}
	setTimeout(stopDB, delay*i);
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
	var routes = require('./routes');

	includeInThisContext(__dirname + "/model.js");


	mongoose.connect(addrmongo, function(err) {
  	if (err) { throw err; }
	});

	console.log('connection is successed with db');
//injection de valeur de température
	var nbT = 10;
	var delay = 5000;
	injectManyMesure(nbT,delay);
}


main();


