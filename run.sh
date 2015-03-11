#!/bin/sh

cd WebServer/initDB/
sh initDB.sh
cd ../
xdg-open "http://localhost:9999/client/"
node serveur.js