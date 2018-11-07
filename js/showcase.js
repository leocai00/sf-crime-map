const URL = "https://data.sfgov.org/resource/cuks-n6tp.json?%24limit="

let state = {
    count: 3000,
    sfData: [],
    dist: [],
    selected: null
};

let map;
let markers = [];
let cluster;

function fetchInfo() {
    let newUrl = URL + state.count;
    fetch(newUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            state.sfData = data;

            renderSelector(data);
            renderMarker(data);
        });
}

fetchInfo();


function renderSelector(data) {
    data.forEach(function (d) {
        let c = d.category;
        if (!state.dist.includes(c)) {
            state.dist.push(c);
            let option = $("<option>" + c + "</option>");
            $("select").append(option);
        }
    })
}

function renderMarker(data) {
    markers = data.map(function (d, i) {
        if (d.category == state.selected || state.selected == null || state.selected == "Choose one") {
            let x = d.x;
            let y = d.y;
            let latLng = new google.maps.LatLng(y, x);
            let marker = new google.maps.Marker({
                position: latLng,
                map: map
            });

            contentString = '<div class="markers">' +
                '<p><strong>' + 'PDID: </strong>' + d.pdid + '</p>' +
                '<p><strong>' + 'Category: </strong>' + d.category + '</p>' +
                '<p><strong>' + 'Descripsion: </strong>' + d.descript + '</p>' +
                '<p><strong>' + 'Date: </strong>' + d.date.substring(0, 10) + '</p>' +
                '<p><strong>' + 'Time: </strong>' + d.time + '</p>' +
                '</div>';
            let infoWindow = new google.maps.InfoWindow({
                content: contentString
            });
            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });
            return marker;
        }
        return null;
    });

    // for (let i = 0; i < data.length; i++) {
    //     contentString = '<div class="markers">' +
    //         '<p><strong>' + 'PDID: </strong>' + data[i].pdid + '</p>' +
    //         '<p><strong>' + 'Category: </strong>' + data[i].category + '</p>' +
    //         '<p><strong>' + 'Descripsion: </strong>' + data[i].descript + '</p>' +
    //         '<p><strong>' + 'Date: </strong>' + data[i].date.substring(0, 10) + '</p>' +
    //         '<p><strong>' + 'Time: </strong>' + data[i].time + '</p>' +
    //         '</div>';
    //     let infoWindow = new google.maps.InfoWindow({
    //         content: contentString
    //     });
    //     markers[i].addListener('click', function () {
    //         infoWindow.open(map, markers[i]);
    //     });
    // }

    cluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
}



function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: new google.maps.LatLng(37.773972, -122.431297),
    });
}

