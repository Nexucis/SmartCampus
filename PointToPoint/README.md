# Communication de carte � carte

Fichiers utiles pour mettre en place la communication entre des shields LORA Mbed branch�s sur des cartes STM32L152RE

Diff�rents dossiers sont disponibles :

# Receiver

Contient le code � compiler et envoyer sur les cartes STM32L152RE pour �tre le r�cepteur.
A r�ception d'un message, celui-ci est envoy� sur le port s�rie.

# Transmitter

Contient le code � compiler et envoyer sur les cartes STM32L152RE pour �tre l'�metteur.
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

Types d'unit�s :

Id : num�ro de la carte, entier non sign� sur 8 bits<br>
Wind direction : direction du vent, en degr� (0 � 360)<br>
Humidity : humidit� relative, en pourcentage<br>
Temperature : temperature en celcius<br>
Wind speed : vitesse du vent, en km par heure<br>
Water : pluviom�trie, en mm<br>
Battery : �tat de la batterie, en volt<br>
Pressure : pression, en hectopascal<br>

# Gateway 

Fichiers pour la machine faisant office de passerelle qui permet l'envoie des donn�es re�u par un r�cepteur branch� en s�rie sur un topic MQTT (ici SmartCampus/meteo).<br>
Un dossier de log est disponible pour avoir des informations sur les probl�mes rencontr�s pendant les diff�rents traitements du script python.

# Server

