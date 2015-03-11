(
echo "lancement de mongod"
start mongod
cd WebServer\initDB
echo "init BDD :"
initDB.bat
echo "BDD init DONE!"
cd ..\
echo "lancement serveur.js ..."
node serveur.js
echo "serveur.js DONE!"
)