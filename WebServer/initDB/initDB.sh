#!/bin/sh

 #import sensor
mongoimport --db Client --host localhost:27017 --collection sensors_datas < dbJSON/sensor.json
 #import item 
mongoimport --db Client --host localhost:27017 --collection items < dbJSON/items.json
 #import entity
mongoimport --db Client --host localhost:27017 --collection entities < dbJSON/entities.json
 #import admin
mongoimport --db Client --host localhost:27017 --collection administrators < dbJSON/administrators.json
