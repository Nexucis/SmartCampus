(
echo "lancement de mongod"
start mongod
cd WebServer\initDB
echo "init BDD :"
initDB.bat
echo "BDD init DONE!"

start http://localhost:9999/client

cd ..\
echo "lancement serveur.js ..."
start node serveur.js
echo "serveur.js DONE!"

)