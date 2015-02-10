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



var ecole = L.icon({
    iconUrl:"/images/school.png",
    iconSize:[25,25],
    iconAnchor:[12,12]
    }),
    tram = L.icon({
    iconUrl:"/images/tramway.png",
    iconSize:[24,24],
    iconAnchor:[12,12]
    }),
    commerce = L.icon({
    iconUrl:"/images/store.png",
    iconSize:[25,25],
    iconAnchor:[12,12]
    }),
    food = L.icon({
    iconUrl:"/images/food.png",
    iconSize:[25,25],
    iconAnchor:[12,12]
    }),
    bar = L.icon({
    iconUrl:"/images/bar.png",
    iconSize:[25,25],
    iconAnchor:[12,12]
    }),
    bed = L.icon({
    iconUrl:"/images/bed.png",
    iconSize:[25,25],
    iconAnchor:[12,12]
    }),
    library = L.icon({
    iconUrl:"/images/library.png",
    iconSize:[25,25],
    iconAnchor:[12,12]
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
