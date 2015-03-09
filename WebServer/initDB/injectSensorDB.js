var tabIdSensor = new Array;

function createSensor(name,type){
	var sensor = new Sensors_dataModel({
		type:type,
		identifiant : name,
		mesure : []
	});
	sensor.save(function (err) {
  		if (err) { throw err; }
  		console.log('sensor : '+name+' is added !');
	});
}
/*
tabSensor : array of id of sensor
*/
function createItem(name,tabSensor){
	var item = new ItemModel({
		name : name,
		Sensors_data : tabSensor
	});
	item.save(function (err) {
  		if (err) { throw err; }
  		console.log('item : '+name+' is added !');
	});
}

function createEntity(name,latitude,longitude,idItem){
	var entity = new EntityModel({
		name : name,
		latitude : latitude,
		longitude : longitude,
		items : [idItem]
	});
	entity.save(function (err) {
  		if (err) { throw err; }
  		console.log('item : '+name+' is added !');
	});
}

function findItemAndCreateEntity(nameEntity,nameItem,latitude,longitude){
	ItemModel.findOne({name: nameItem }, 
		function (err, doc){
			if(err){
				throw(err);
			}
			if (doc === null){
				throw("error : item with name : " +nameItem+" isn't found");
				
			}
			console.log("the item with name : "+nameItem+" is found");

			
			createEntity(nameEntity,latitude,longitude,doc._id);
			
  		}
	);
}

function findFullSensorAndCreateItem(nameEntity, nameItem,tabNameSensor,latitude,longitude,i){

	Sensors_dataModel.findOne({identifiant: tabNameSensor[i] }, 
		function (err, doc){
			if(err){
				throw(err);
			}
			if (doc === null){
				throw("error : sensor with name : " +tabNameSensor[i]+" isn't found");
				
			}
			console.log("the sensor with name : "+tabNameSensor[i]+" is found");

			tabIdSensor[i] = doc._id;
			if(i+1<tabNameSensor.length){
				findFullSensorAndCreateItem(nameEntity, nameItem,tabNameSensor,latitude,longitude,i+1)
			}
			
			else{
			        createItem(nameItem,tabIdSensor);
				setTimeout(function(){
					findItemAndCreateEntity(nameEntity,nameItem,latitude,longitude);
				},5000);
				
			}
  		}
	);
}

function createFullSensor(tabNameSensor,tabTypeSensor, nameEntity, nameItem,latitude,longitude){
	var i = 0;
	var length = tabNameSensor.length;
	var sensor;
	while(i<length){
		createSensor(tabNameSensor[i],tabTypeSensor[i]);
		i++;
	}
	setTimeout(function(){
		findFullSensorAndCreateItem(nameEntity,nameItem,tabNameSensor,latitude,longitude,0);
	},5000);
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

	var tabNameSensor = new Array;
	tabNameSensor[0] = "sensor1";
	tabNameSensor[1] = "sensor2";
	tabNameSensor[2] = "sensor3";

	var tabTypeSensor = new Array;
	tabTypeSensor[0] = "humidity";
	tabTypeSensor[1] = "temperature";
	tabTypeSensor[2] = "pression";

	createFullSensor(tabNameSensor,tabTypeSensor, "le case d'al", "Tacos",125,135);
}


main();
