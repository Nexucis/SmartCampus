# English
## Chip to chip communication
Useful files to set up to communication between Mbed LoRa shields wired to STM32L152RE chips.

Differents folders are available :

## Receiver

Contains the code to compile and send to the STM32L152RE chips in order to be the receiver. 
When a message is received, it is send throught the serial port.

## Transmitter

Contains the code to compile and send to the STM32L152RE chips in order to be the transmitter.
The sent messages have to following format :

<pre>
0               8                               24              32              40
+---------------+---------------+---------------+---------------+---------------+
|               |                               |               |               |
|     Id        |         Wind direction        |   Humidity    | Temperature   |
|               |                               |               |               |
+---------------+---------------+---------------+---------------+---------------+
</pre>

<pre>
40                                                              72
+---------------+---------------+---------------+---------------+
|                                                               |
|                           Wind speed                          |
|                                                               |
+---------------+---------------+---------------+---------------+
</pre>

<pre>
72                                                              104
+---------------+---------------+---------------+---------------+
|                                                               |
|                             Water                             | 
|                                                               |
+---------------+---------------+---------------+---------------+
</pre>
<pre>
104                                                             136
+---------------+---------------+---------------+---------------+
|                                                               |
|                             Battery                           | 
|                                                               |
+---------------+---------------+---------------+---------------+
</pre>
<pre>
136                                                             168
+---------------+---------------+---------------+---------------+
|                                                               |
|                           Pressure                            | 
|                                                               |
+---------------+---------------+---------------+---------------+
</pre>
Unites types :

Id : chip number, unsigned integer on 8 bits<br>
wind direction : in degree (0 to 360)<br>
Humidity : in percentage <br>
Temperature : in degree celcius<br>
Wind speed : in km/h<br>
Water : pluviometry, in milimeters<br>
Battery : battery status, in volt<br>
Pressure : in hectopascal<br>

## Gateway 

Files used by the machine acting as the gateway which enable the send of data received by the receiver, wired on a serial port, on a MQTT topic (SmartCampus/meteo).<br>
The script asks the user which serial port on which the chip is connected. The full name has to be written (for example COM3 on Windows). For Linux users, don't forget to write the serial port name between quotes ('). Those scripts work on Linux, Mac OSX and Windows.<br>
Those data are then sent through MQTT on the topic : SmartCampus/meteo.<br>
A log  folder is available for more information on errors encontered during the differents python processing scripts.

## Server

Files used by the machine acting as the server (store data in the database).<br>
The script suscribes to the topic SmartCampus/meteo and get messages to parse them. They must have the following form : ID#WindDirection#Humidity#Temperature#WindSpeed#Pluviometry#Battery#Pressure. The data format is also checked.<br>
Those are then inserted in the MongoDB database.<br>
A log  folder is available for more information on errors encontered during the differents python processing scripts.
# Français
## Communication de carte à carte

Fichiers utiles pour mettre en place la communication entre des shields LORA Mbed branchés sur des cartes STM32L152RE

Différents dossiers sont disponibles :

## Receiver

Contient le code à compiler et envoyer sur les cartes STM32L152RE pour être le récepteur.
A réception d'un message, celui-ci est envoyé sur le port série.

## Transmitter

Contient le code à compiler et envoyer sur les cartes STM32L152RE pour être l'émetteur.
Le format d'envoie des messages est le suivant :

<pre>
0               8                               24              32              40
+---------------+---------------+---------------+---------------+---------------+
|               |                               |               |               |
|     Id        |         Wind direction        |   Humidity    | Temperature   |
|               |                               |               |               |
+---------------+---------------+---------------+---------------+---------------+
</pre>

<pre>
40                                                              72
+---------------+---------------+---------------+---------------+
|                                                               |
|                           Wind speed                          |
|                                                               |
+---------------+---------------+---------------+---------------+
</pre>

<pre>
72                                                              104
+---------------+---------------+---------------+---------------+
|                                                               |
|                             Water                             | 
|                                                               |
+---------------+---------------+---------------+---------------+
</pre>
<pre>
104                                                             136
+---------------+---------------+---------------+---------------+
|                                                               |
|                             Battery                           | 
|                                                               |
+---------------+---------------+---------------+---------------+
</pre>
<pre>
136                                                             168
+---------------+---------------+---------------+---------------+
|                                                               |
|                           Pressure                            | 
|                                                               |
+---------------+---------------+---------------+---------------+
</pre>

Types d'unités :

Id : numéro de la carte, entier non signé sur 8 bits<br>
Wind direction : direction du vent, en degré (0 à 360)<br>
Humidity : humidité relative, en pourcentage<br>
Temperature : temperature en celcius<br>
Wind speed : vitesse du vent, en km par heure<br>
Water : pluviométrie, en mm<br>
Battery : état de la batterie, en volt<br>
Pressure : pression, en hectopascal<br>

## Gateway 

Fichiers pour la machine faisant office de passerelle qui permet l'envoie des données reçu par un récepteur branché en série sur un topic MQTT (ici SmartCampus/meteo).<br>
Le script demande à l'utilisateur le port série sur lequel la carte est connectée. Il faut écrire le nom en entier (par exemple COM3 pour Windows). Pour les utilisateurs de Linux, il ne faut pas oublier de taper le nom du port entre quotes simples ('). Script fonctionnant pour Linux, Mac et Windows.<br>
Les données sont ensuite envoyées par MQTT sur le topic SmartCampus/meteo.<br>
Un dossier de log est disponible pour avoir des informations sur les problèmes rencontrés pendant les différents traitements du script python.

## Server

Fichier pour la machine faisant office de serveur (stockage des données dans la base de donnée).<br>
Le script s'inscrit sur le topic SmartCampus/meteo et récupère les messages pour les parser. Ceux-ci doivent être de la forme ID#DirectionDuVent#Humidite#Temperature#VitesseDuVent#Pluviometrie#Batterie#Pression. Le format des données est également vérifié.<br>
Les données sont enuite insérées dans la base de donnée MongoDB.<br>
Un dossier de log est disponible pour avoir des informations sur les problèmes rencontrés pendant les différents traitements du script python.
