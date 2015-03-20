#! /usr/bin/python2.7
# -*-coding:Utf-8 -*
# Created by SAMBE Adji
# On 03/13/2015

import datetime
import logging
import sys
import os 
import pymongo
import paho.mqtt.client as paho
from pymongo import MongoClient
import json
from bson import json_util
    
#The following methods check if a string is a particular number or not.
def isInteger(s):
    try:
        int(s)
        return True
    except:
        return False
 
def isFloat(s):
    try:
        float(s)
        return True
    except:
        return False

def process(msg) :
    #ID#DirectionDuVent#Humidite#Temperature#VitesseDuVent#Pluviometrie#Batterie#Pression
    s = msg.split("#")
    l = len(s)
    # we check if lenght is correct and all values are conformed to their domain definition.
    # In this case, conversions are performed and values are added to the database.
    # Otherwise a log warning is made.
    if (l==8 and isInteger(s[0]) and isInteger(s[1]) and isInteger(s[2]) and isFloat(s[3]) and
        isFloat(s[4]) and isFloat(s[5]) and isFloat(s[6]) and isFloat(s[7]) and int(s[0])>= 1 and int(s[1])>0 and
        int(s[1])<=360 and int(s[2])>0  and int(s[2]) <=100 and float(s[3])>0 and float(s[4])>0 and float(s[5])>0):
        for i in range (0,3):
            s[i] = int(s[i])
        for i in range (3,8):
            s[i]=float(s[i])
        for i in range (0,l): 
            print (s[i])

        clientMONGO = MongoClient('localhost', 27017)
        db = clientMONGO.Client
        collection = db.sensorswireless_datas

        post = {"name" : str(s[0]),
                "temperature" :s[3],
                "pression" :(s[7]/100),
                "luminosite" : float(0.0),
                "pluviometrie" :s[5],
                "directionVent" :str(s[1]),
                "humidite" :s[2],
                "vitesseVent" :s[4],
                "date": datetime.datetime.utcnow()
                }
        post_id = collection.insert(post)
   
    else :
        time = datetime.datetime.now()
        string = time.isoformat() + " : Invalid values\n" + msg
        logging.warning(string)

#MQTT Callback
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("SmartCampus/meteo")
    
    
# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    toProcess = str(msg.payload)
    process(toProcess)

# Create a log file
if not os.path.exists("logs"):
    os.makedirs("logs")
logging.basicConfig(filename='logs/scriptMQTTBDDLogs.log', level=logging.DEBUG)
time = datetime.datetime.now()
string = time.isoformat() + " : Starting of the MQTT-Mongo script"
logging.info(string)

#MQTT configuration
broker = "85.190.181.46"
topic = "SmartCampus/meteo"
port = 1883
clientMQTT = paho.Client()
clientMQTT.on_connect = on_connect
clientMQTT.on_message = on_message

try :
    clientMQTT.connect(broker, port, 60)
except Exception as e :
    time = datetime.datetime.now()
    string = time.isoformat() + ": Error, impossible to connect to the server\n" + str(e)
    logging.error(string)
    print("Error, exiting...")
    sys.exit(-1)
    
clientMQTT.loop_forever()


