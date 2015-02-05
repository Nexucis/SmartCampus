ln -s /dev/stdout /dev/ttyGS0
cd mosquitto*
./src/mosquitto -c src/mosquitto.conf &
cd ..
cd smartcampus
python filtre*.py &
python ino*.py &

