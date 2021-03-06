/*
 * SmartCampus
 *  ©SmartCampus 2015 https://github.com/nexucis/SmartCampus
 *  License MIT
 */

var map = L.map('map-canvas').setView([45.19, 5.76], 14)
.on('click',function(e){
    hidePanel();
});

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

var capteur = L.AwesomeMarkers.icon({
    icon:'connectdevelop',
    prefix:'fa',
    markerColor:'darkpurple'
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
                displayPanelInfoPOI();
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
        marker = L.marker([value.latitude, value.longitude], {icon:capteur})
            .addTo(map)
            .on('click', function (e) {
            buildPannelSensor(value);
            if(!$("#panelInfoSensors").is(":visible"))
                displayPanelInfoSensor();
        })
            .addTo(sensorLayer)
            .bindPopup('<ul class="nav nav-pills">\
<li role="presentation"><a href="#" id="humidity">Humidité</a></li>\
<li role="presentation"><a href="#" id="temperature">Température</a></li>\
<li role="presentation"><a href="#" id="pression">Pression</a></li>\
<li role="presentation"><a href="#" id="luminosite">Luminosité</a></li>\
<li role="presentation"><a href="#" id="pluviometrie">Pluviométrie</a></li>\
<li role="presentation"><a href="#" id="vitesseVent">Vitesse Vent</a></li>\
</ul>\
<div id="container" style="min-width: 400px; height: 400px; margin: 0 auto"></div>')
            .on('click',function(e){
            drawGraph(value, "Humidité");

            $("#humidity").click(function(){
                drawGraph(value, "Humidité");
            });
            $("#temperature").click(function(){
                drawGraph(value, "Température");
            });
            $("#pression").click(function(){
                drawGraph(value, "Pression");
            });
            $("#luminosite").click(function(){
                drawGraph(value, "Luminosité");
            });
            $("#pluviometrie").click(function(){
                drawGraph(value, "Pluviométrie");
            }); 
            $("#vitesseVent").click(function(){
                drawGraph(value, "Vitesse du vent");
            });
        });
    });
});




var overlays = {
    "Points of interest": poiLayer,
    "Sensors":sensorLayer,
}

L.tileLayer(mapboxUrl, {
    attribution: mapboxAttribution,
    maxZoom:18,
    layers:[poiLayer,sensorLayer]
}).addTo(map);

L.control.layers(null,overlays).addTo(map);
L.easyButton('fa-twitter', displayPanelTwitter,'Twitter of UJF')
L.easyButton('fa-sun-o', displayPanelInfoSensor,"Display the sensor informations")
L.easyButton('fa-info', displayPanelInfoPOI,'Display the POI information')

//gestion du panel d'affichage des info
$('#panelPOI').hide();
$('#panelTwitter').hide();
$('#panelInfoSensors').hide();

function displayPanelTwitter(){
    if($("#panelInfoSensors").is(":visible"))
        $("#panelInfoSensors").toggle("slide",{ direction: "right" });

    if($("#panelPOI").is(":visible"))
        $("#panelPOI").toggle("slide",{ direction: "right" });

    $("#panelTwitter").toggle("slide",{ direction: "right" });


}

function displayPanelInfoSensor(){
    if($("#panelPOI").is(":visible"))
        $("#panelPOI").toggle("slide",{ direction: "right" });

    if($("#panelTwitter").is(":visible"))
        $("#panelTwitter").toggle("slide",{ direction: "right" });

    $("#panelInfoSensors").toggle("slide",{ direction: "right" });
}


function displayPanelInfoPOI(){
    if($("#panelTwitter").is(":visible"))
        $("#panelTwitter").toggle("slide",{ direction: "right" });

    if($("#panelInfoSensors").is(":visible"))
        $("#panelInfoSensors").toggle("slide",{ direction: "right" });

    $("#panelPOI").toggle("slide",{ direction: "right" });
}

function hidePanel(){
    if($("#panelTwitter").is(":visible"))
        $("#panelTwitter").toggle("slide",{ direction: "right" });

    if($("#panelPOI").is(":visible"))
        $("#panelPOI").toggle("slide",{ direction: "right" });

    if($("#panelInfoSensors").is(":visible"))
        $("#panelInfoSensors").toggle("slide",{ direction: "right" });

}



