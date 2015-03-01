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
        })
        .addTo(poiLayer);
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
L.easyButton('fa-sun-o', displayPannelWeather,"Display the weather")
L.easyButton('fa-info', displayPannelInfo,'Display the sensor information')


$('#panel').hide();

function displayPannelTwitter(){
    $("#panel").toggle("slide");
    
}

function displayPannelWeather(){
    $("#panel").toggle("slide");
}


function displayPannelInfo(){
    $("#panel").toggle("slide");
}


