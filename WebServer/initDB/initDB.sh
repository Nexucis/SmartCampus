#!/bin/sh

 #import mesures
mongoimport --db Client --host localhost:27017 --collection mesures < dbJSON/mesures.json
 #import sensor
mongoimport --db Client --host localhost:27017 --collection sensors_datas < dbJSON/sensors_datas.json
 #import comments
mongoimport --db Client --host localhost:27017 --collection comments < dbJSON/comments.json
 #import item 
mongoimport --db Client --host localhost:27017 --collection items < dbJSON/items.json
 #import entity
mongoimport --db Client --host localhost:27017 --collection entities < dbJSON/entities.json
 #import admin
mongoimport --db Client --host localhost:27017 --collection administrators < dbJSON/administrators.json
