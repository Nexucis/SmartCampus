/*
 * SmartCampus
 *  ©SmartCampus 2015 https://github.com/nexucis/SmartCampus
 *  License MIT
 */

var map = L.map('map-canvas').setView([45.19, 5.76], 14);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom:18
    }).addTo(map);



var ecole = L.AwesomeMarkers.icon({
    icon: 'education',
    prefix: 'glyphicon',
    markerColor: 'blue'
  })
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
                        });
                });
            });