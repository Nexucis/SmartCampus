(
echo "suppression de la bd"
mongo Client --eval "db.dropDatabase()"
echo "import mesures"
mongoimport --db Client --host localhost:27017 --collection mesures < dbJSON\mesures.json
echo "import sensor"
mongoimport --db Client --host localhost:27017 --collection sensors_datas < dbJSON\sensors_datas.json
echo "import comments"
mongoimport --db Client --host localhost:27017 --collection comments < dbJSON\comments.json
echo "import item" 
mongoimport --db Client --host localhost:27017 --collection items < dbJSON\items.json
echo "import entity"
mongoimport --db Client --host localhost:27017 --collection entities < dbJSON\entities.json
echo "import admin"
mongoimport --db Client --host localhost:27017 --collection administrators < dbJSON\administrators.json
echo "import sensorswireless_datas"
mongoimport --db Client --host localhost:27017 --collection sensorswireless_datas < dbJSON/sensorswireless_datas.json
echo "import sensorswireless_datas"
mongoimport --db Client --host localhost:27017 --collection sensorswirelesses < dbJSON/sensorswirelesses.json
)