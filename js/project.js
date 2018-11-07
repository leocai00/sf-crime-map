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
    data.forEach(function (d) {
        if (d.category == state.selected || state.selected == null || state.selected == 'All') {
            let x = d.x;
            let y = d.y;
            let latLng = new google.maps.LatLng(y, x);
            let marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: 'marker'
            });

            let contentString = '<div class="markers">' +
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
            markers.push(marker);
        }
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

    $("#clear").click(function () {
        cluster.clearMarkers();
    });

    // Create a div to hold the control.
    var controlDiv = document.createElement('div');

    //### Add a button on Google Maps ...
    var controlMarkerUI = document.createElement('button');
    controlMarkerUI.innerHTML = "Menu";
    controlMarkerUI.setAttribute("type", 'button');
    controlMarkerUI.classList.add("btn", "btn-secondary");
    controlMarkerUI.style.cursor = 'pointer';
    controlMarkerUI.style.height = '40px';
    controlMarkerUI.style.width = '80px';
    controlMarkerUI.style.marginLeft = '10px';
    controlMarkerUI.style.marginTop = '8px';
    controlMarkerUI.title = 'Expand the Main Menu';
    controlDiv.appendChild(controlMarkerUI);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);

    controlMarkerUI.addEventListener("click", function () {
        expend();
    })
}

$('form').submit(function (event) {
    event.preventDefault();

    if($('#count').val() != "") {
        state.count = $('#count').val();
    }
    state.selected = $('#category :selected').val();
    markers = [];

    fetchInfo();
    expend();
    map.setZoom(12);
});

function expend() {
    let form = document.querySelector("#sheet");
    console.log(form.style.height);
    if (form.style.height == 0 || form.style.height == "0px") {
        let height = 0;
        let id = setInterval(frame, 3);
        function frame() {
            if (height == 210) {
                clearInterval(id);
            } else {
                height++;
                form.style.height = height + 'px';
            }
        }
        form.style.marginTop = "20px";
        form.style.marginBottom = "20px";
    }
    if (form.style.height == "210px") {
        console.log("1")
        let height = 210;
        let id = setInterval(frame, 3);
        function frame() {
            if (height == 0) {
                clearInterval(id);
            } else {
                height--;
                form.style.height = height + 'px';
            }
        }
        form.style.marginTop = "0";
        form.style.marginBottom = "0";
    }
}