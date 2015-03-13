# Communication de carte à carte

Fichiers utiles pour mettre en place la communication entre des shields LORA Mbed branchés sur des cartes STM32L152RE

Différents dossiers sont disponibles :

# Receiver

Contient le code à compiler et envoyer sur les cartes STM32L152RE pour être le récepteur.
A réception d'un message, celui-ci est envoyé sur le port série.

# Transmitter

Contient le code à compiler et envoyer sur les cartes STM32L152RE pour être l'émetteur.
Le format d'envoie des messages est le suivant :

0				8								24				32				40
+---------------+---------------+---------------+---------------+---------------+
|				|								|				|				|				
|	  Id		|		Wind direction			|    Humidity	|  Temperature	|
|				|								|				|				|
+---------------+---------------+---------------+---------------+---------------+

40																72
+---------------+---------------+---------------+---------------+
|																|
|	  						Wind speed							| 
|																|
+---------------+---------------+---------------+---------------+

72																104
+---------------+---------------+---------------+---------------+
|																|
|	  						  Water								| 
|																|
+---------------+---------------+---------------+---------------+

104																136
+---------------+---------------+---------------+---------------+
|																|
|	  						 Battery							| 
|																|
+---------------+---------------+---------------+---------------+

136																168
+---------------+---------------+---------------+---------------+
|																|
|	  						 Pressure							| 
|																|
+---------------+---------------+---------------+---------------+


Types d'unités :

Id : numéro de la carte, entier non signé sur 8 bits
Wind direction : direction du vent, en degré (0 à 360)
Humidity : humidité relative, en pourcentage
Temperature : temperature en celcius
Wind speed : vitesse du vent, en km par heure
Water : pluviométrie, en mm
Battery : état de la batterie, en volt
Pressure : pression, en hectopascal

# Gateway 

Fichiers pour la machine faisant office de passerelle qui permet l'envoie des données reçu par un récepteur branché en série sur un topic MQTT (ici SmartCampus/meteo).
Un dossier de log est disponible pour avoir des informations sur les problèmes rencontrés pendant les différents traitements du script python.

# Server


