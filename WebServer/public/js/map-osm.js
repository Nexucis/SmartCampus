/*
 * SmartCampus
 *  ©SmartCampus 2015 https://github.com/nexucis/SmartCampus
 *  License MIT
 */

var map = L.map('map-canvas').setView([45.19, 5.76], 14);

var mapboxUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    mapboxAttribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

var ecole = L.AwesomeMarkers.icon({
    icon: 'education',
    prefix: 'glyphicon',
    markerColor: 'blue'
}),
    tram = L.AwesomeMarkers.icon({
        icon: 'subway',
        prefix: 'fa',
        markerColor: 'green'
    }),
    commerce = L.AwesomeMarkers.icon({
        icon: 'shopping-cart',
        prefix: 'fa',
        markerColor: 'red'
    }),
    food = L.AwesomeMarkers.icon({
        icon: 'cutlery',
        prefix: 'fa',
        markerColor: 'purple'
    }),
    bar = L.AwesomeMarkers.icon({
        icon: 'beer',
        prefix: 'fa',
        markerColor: 'darkgreen'
    }),
    bed = L.AwesomeMarkers.icon({
        icon: 'bed',
        prefix: 'fa',
        markerColor: 'cadetblue'
    }),
    library = L.AwesomeMarkers.icon({
        icon: 'book',
        prefix: 'glyphicon',
        markerColor: 'orange'
    });

var ICONS = {
    "Université": ecole,
    "Ecole d'ingénieur": ecole,
    "Ecole": ecole,
    "Tramway": tram,
    "Tram": tram,
    "Commerce": commerce,
    "Restaurant Universitaire": food,
    "Cité Universitaire": bed,
    "Laboratoire": ecole,
    "Bibliothèque": library,
    "Bar":bar
};

//define layers
var poiLayer = new L.LayerGroup();
var pois = [];

$.getJSON('/api/entity/',
          function(data) {
    var entity = 0;
    while (data.payload[entity]) {
        if (data.payload[entity].latitude && data.payload[entity].longitude) {
            pois.push(
                data.payload[entity]
            );
        }
        entity++;
    }
    var marker;
    $.each(pois, function(index, value) {
        marker = L.marker([value.latitude, value.longitude], {icon:ICONS[value.type]})
            .addTo(map)
            .on('click', function (e) {
            buildPanel(value);
            if(!$("#panelPOI").is(":visible"))
                displayPannelInfoPOI();


        })
            .addTo(poiLayer);
    });
});


//display the sensors
var sensor = [];
var sensorLayer = new L.LayerGroup();;

$.getJSON('/api/SensorsWireless/',
          function(data) {
    var sensorName = 0;
    while (data.payload[sensorName]) {
        if (data.payload[sensorName].latitude && data.payload[sensorName].longitude) {
            sensor.push(
                data.payload[sensorName]
            );
        }
        sensorName++;
    }
    var marker;
    $.each(sensor, function(index, value) {
        marker = L.marker([value.latitude, value.longitude])
            .addTo(map)
            .on('click', function (e) {
                displayPannelInfoSensor();
        })
            .addTo(sensorLayer);
    });
});




var overlays = {
    "Points of interest": poiLayer
}

L.tileLayer(mapboxUrl, {
    attribution: mapboxAttribution,
    maxZoom:18,
    layers:[poiLayer]
}).addTo(map);

L.control.layers(null,overlays).addTo(map);
L.easyButton('fa-twitter', displayPannelTwitter,'Twitter of UJF')
L.easyButton('fa-sun-o', displayPannelInfoSensor,"Display the sensor informations")
L.easyButton('fa-info', displayPannelInfoPOI,'Display the POI information')

//gestion du panel d'affichage des info
$('#panelPOI').hide();
$('#panelTwitter').hide();
$('#panelInfoSensors').hide();

function displayPannelTwitter(){
    if($("#panelInfoSensors").is(":visible"))
        $("#panelInfoSensors").toggle("slide",{ direction: "right" });

    if($("#panelPOI").is(":visible"))
        $("#panelPOI").toggle("slide",{ direction: "right" });

    $("#panelTwitter").toggle("slide",{ direction: "right" });


}

function displayPannelInfoSensor(){
    if($("#panelPOI").is(":visible"))
        $("#panelPOI").toggle("slide",{ direction: "right" });

    if($("#panelTwitter").is(":visible"))
        $("#panelTwitter").toggle("slide",{ direction: "right" });

    $("#panelInfoSensors").toggle("slide",{ direction: "right" });
}


function displayPannelInfoPOI(){
    if($("#panelTwitter").is(":visible"))
        $("#panelTwitter").toggle("slide",{ direction: "right" });

    if($("#panelInfoSensors").is(":visible"))
        $("#panelInfoSensors").toggle("slide",{ direction: "right" });

    $("#panelPOI").toggle("slide",{ direction: "right" });
}