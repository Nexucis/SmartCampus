#!/bin/sh

 #import sensor
mongoimport --db test --collection sensors_datas < dbJSON/sensor.json
 #import item 
mongoimport --db test --collection item < dbJSON/item.json
 #import entity
mongoimport --db test --collection entity < dbJSON/entity.json
 #import admin
mongoimport --db test --collection administrator < dbJSON/admin.json
