/*
 * SmartCampus
 *  ©SmartCampus 2015 https://github.com/nexucis/SmartCampus
 *  License MIT
 */

var capteur = L.AwesomeMarkers.icon({
    icon:'connectdevelop',
    prefix:'fa',
    markerColor:'blue'
});

var map = L.map('mapAdmin').setView([45.19, 5.76], 14);

var mapboxUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    mapboxAttribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

L.tileLayer(mapboxUrl, {
    attribution: mapboxAttribution,
    maxZoom:18,
}).addTo(map);

var marker;

map.on('click', function(e) {
    if(marker != null){
        map.removeLayer(marker)
    }
    $("#latitude").val(e.latlng.lat);
    $("#longitude").val(e.latlng.lng);
    marker = new L.marker([e.latlng.lat, e.latlng.lng], {icon:capteur})
    map.addLayer(marker);

});


