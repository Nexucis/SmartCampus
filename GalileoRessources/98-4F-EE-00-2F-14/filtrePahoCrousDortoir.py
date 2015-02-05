#Created by SmartCampus2014
#Modified by SmartCampus2015

import paho.mqtt.client as paho                                                                       
import time, os                                                                                       
                                                                                                      
                                                                                                      
#############################                                                                         
####  Broker   Galileo ######                                                                         
#############################                                                                         
                                                                                                      
brokerGalileo="localhost"                                                                             
portGalileo = 1883                                                                                    
topicGalileo ="GPL"                                                                                   
identifiantCapteur = "CROUSDortoirChambreMBairQualite"                                                
                                                                                                      
nameMosquitto = "Galileo"                                                                             
                                                                                                      
mypid = os.getpid()                                                                                   
pub= "pubclient_"+str(mypid)                                                                          
mqttc = paho.Client(pub, False) #nocleanstart                                                         
mqttc.connect(brokerGalileo, portGalileo, 60)                                                         
                                                                                                      
                                                                                                      
mqttc_ext = paho.Client("pub", False) #nocleanstart                                                   
#Connection to the NUC server                                                   
mqttc_ext.connect("192.168.254.1", portGalileo,60)

                                                                                                      
#On receipt of a message resend it to the broker of the server                                        
def on_message(mosq, obj, msg):                                                                       
                                                                              
        if msg and msg.topic and msg.payload and mqttc:                                               
               
	       	# Print some information in case of problems
	       	# print "Logs"                                                                  
               	# print str(msg.topic)+" "+str(msg.payload)+ str(type(msg.payload))                     
                                                                                                      
         	mqttc_ext.publish("sensor" ,str(identifiantCapteur)+"@"+str(msg.payload) )            
                                                                                        
                                                                                                      
                                                                                                      
mqttc.subscribe(topicGalileo,0)                                                                       
                                                                                                      
#define the callbacks                                                                                 
mqttc.on_message = on_message                                                                         
                                                                                                                                                                                                           
while 1:                                                                                              
                                                                                                                                                                                                                                                                                                                
        try:                                                                                          
                mqttc.loop(100)                                                                       
        except TypeError:                                                                             
                print "Error"      
