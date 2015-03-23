#! /usr/bin/python2.7
# -*-coding:Utf-8 -*
# Created by Barbier Jérôme and Fréby Rodolphe
# Project SmartCampus2015
# 27/02/2015

import serial
import array
import sys
import paho.mqtt.client as paho
import struct
import datetime
import os
import logging
import time
import glob


# Definition of the methods

# Selection of the Serial port
# Part of the code from stack overflow
# http://stackoverflow.com/questions/12090503/listing-available-com-ports-with-python
def serial_ports():
    if sys.platform.startswith('win'):
        ports = ['COM' + str(i + 1) for i in range(256)]

    elif sys.platform.startswith('linux') or sys.platform.startswith('cygwin'):
        ports = glob.glob('/dev/tty[A-Za-z]*')

    elif sys.platform.startswith('darwin'):
        ports = glob.glob('/dev/tty.*')

    else:
        time = datetime.datetime.now()
        string = time.isoformat() + " : Error, operating system not supported (not Mac, Linux or Windows)\n" + str(e)
        logging.error(string)
        print("Error, operating system not supported, exiting...")
        sys.exit(-3)

    result = []
    for port in ports:
        try:
            s = serial.Serial(port)
            s.close()
            result.append(port)
        except (OSError, serial.SerialException):
            pass
    return result
# End of the stack overflow part

# To read on the serial port
def ReadSerie():
    try:
        ser = serial.Serial(serialPort, 9600, timeout=1)
    except Exception as e:
        # If there is a problem during the serial
        # connection
        time = datetime.datetime.now()
        string = time.isoformat() + " : Error, impossible to connect to the serial port\n" + str(e)
        logging.error(string)
        print("Error, impossible to connect to the serial port, exiting...")
        sys.exit(-2)
    result = ser.read(1024)
    ser.close()
    s = "DEFAULT"
    try:
        s = result.decode("utf-8")
    except Exception as e:
        time = datetime.datetime.now()
        string = time.isoformat() + " : Error, impossible to decode in UTF-8\n" + str(e)
        logging.error(string)
    if s == "TIMEOUT":
        # Create a log report
        print("Timeout for the receiver")
        time = datetime.datetime.now()
        string = time.isoformat() + " : Timeout on the receiver"
        logging.warning(string)
    elif s == "ERROR":
        # Create a log report
        time = datetime.datetime.now()
        print("Error during the transmission")
        string = time.isoformat() + " : Error during the transmission"
        logging.error(string)
    elif s == "DEFAULT":
        print("Default")
    elif s == '':
        print("Nothing received")
    else:
        print(s)
        mqttc.publish(topic, s, 0)

# Program

# Create log file
if not os.path.exists("logs"):
    os.makedirs("logs")
logging.basicConfig(filename='logs/scriptSerialMQTTLogs.log', level=logging.DEBUG)
time = datetime.datetime.now()
string = time.isoformat() + " : Starting of the Serial-MQTT script"
logging.info(string)

# Print and chose a serial
# port
print("List of serial ports : ")
print(serial_ports())
serialPort = input("Please enter the serial port where your device is connected (don't forget ' for linux users) : ")

# For mqtt
broker = "85.190.181.46"
port = 1883
topic = "SmartCampus/meteo"
mqttc = paho.Client()

# Connect to broker
try:
    mqttc.connect(broker, port, 60)
except Exception as e:
    # If there is a
    # problem during
    # the connection
    time = datetime.datetime.now()
    string = time.isoformat() + " : Error, impossible to connect to the server\n" + str(e)
    logging.error(string)
    print("Error, impossible to connect to the server, exiting...")
    sys.exit(-1)

while True:
    ReadSerie()
