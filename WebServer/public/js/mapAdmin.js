/*
 * SmartCampus
 *  ©SmartCampus 2015 https://github.com/nexucis/SmartCampus
 *  License MIT
 */


    
    var map = L.map('mapAdmin').setView([45.19, 5.76], 14);

    var mapboxUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        mapboxAttribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

    L.tileLayer(mapboxUrl, {
        attribution: mapboxAttribution,
        maxZoom:18,
    }).addTo(map);

