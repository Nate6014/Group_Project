var map;
var marker;
var infowindow;
var messagewindow;
var newRow = $("<div class='row'>");
var markers = [];

function deleteMarkers() {
  clearMarkers();
  markers = [];
};

function clearMarkers() {
  setMapOnAll(null);
  
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  };
};

function addYourLocationButton(map) {
  var controlDiv = document.createElement('div');

  var firstChild = document.createElement('button');
  firstChild.style.backgroundColor = '#fff';
  firstChild.style.border = 'none';
  firstChild.style.outline = 'none';
  firstChild.style.width = '28px';
  firstChild.style.height = '28px';
  firstChild.style.borderRadius = '2px';
  firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
  firstChild.style.cursor = 'pointer';
  firstChild.style.marginRight = '10px';
  firstChild.style.padding = '0';
  firstChild.title = 'Your Location';
  controlDiv.appendChild(firstChild);

  var secondChild = document.createElement('div');
  secondChild.style.margin = '5px';
  secondChild.style.width = '18px';
  secondChild.style.height = '18px';
  secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
  secondChild.style.backgroundSize = '180px 18px';
  secondChild.style.backgroundPosition = '0 0';
  secondChild.style.backgroundRepeat = 'no-repeat';
  firstChild.appendChild(secondChild);

  google.maps.event.addListener(map, 'center_changed', function () {
    secondChild.style['background-position'] = '0 0';
  });

  firstChild.addEventListener('click', function () {
    var imgX = '0',
      animationInterval = setInterval(function () {
        imgX = imgX === '-18' ? '0' : '-18';
        secondChild.style['background-position'] = imgX + 'px 0';
      }, 500);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(latlng);
        clearInterval(animationInterval);
        secondChild.style['background-position'] = '-144px 0';
      });
    } else {
      clearInterval(animationInterval);
      secondChild.style['background-position'] = '0 0';
    }
  });

  controlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}


function initMap() {
  var california = { lat: 37.4419, lng: -122.1419 };
  map = new google.maps.Map(document.getElementById('map'), {
    center: california,
    zoom: 9,
    streetViewControl: false,
    disableDefaultUI: true
  });


  var latitude = sessionStorage.getItem("lat");
  var longitude = sessionStorage.getItem("log");
  latitude = parseFloat(latitude);
  longitude = parseFloat(longitude);

  var userPos = {
    lat: latitude,
    lng: longitude
  };

 

  if (isNaN(latitude) || isNaN(longitude)) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var Lat = position.coords.latitude;
      var Lon = position.coords.longitude;
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      sessionStorage.setItem("lat", Lat);
      sessionStorage.setItem("log", Lon);

      map.setCenter(pos);

    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }
  else {
    map.setCenter(userPos);
    var userLink = sessionStorage.getItem("userLink");
    $("#player").attr("src", userLink);
    
  };

  var myMarker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    zoom: 14
  });

  addYourLocationButton(map, myMarker);
  google.maps.event.addListener(map, 'click', function (event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map,

    });
  markers.push(marker);
     

    $("input").on("click", function(){
      deleteMarkers();
    });

    google.maps.event.addListener(marker, 'click', function () {
      console.log(event);
      var lat = event.latLng.lat();
      var long = event.latLng.lng();

      console.log(lat);
      console.log(long);

      var queryURL =
        `https://webcamstravel.p.mashape.com/webcams/list/nearby=${lat},${long},150/limit=18?show=webcams%3Aplayer%2Clocation&lang=en`;

      $.ajax({
        headers: {
          "X-Mashape-Key": "3765685265msh8f78976ecc9bc96p1993c5jsndd3be73bed11",
          "X-Mashape-Host": "webcamstravel.p.mashape.com"
        },
        url: queryURL,
        success: function (data) {
          console.log(data.result);
          $("#playerList").append(newRow);
          $("#playerList").css("border-style", "solid");
          $("#playerList").css("border-radius", "10px");

          for (i = 0; i < data.result.webcams.length; i++) {
            $(".row").append($("<div>").attr("class", "col s1.5").attr("id", "player" + i));
            if (data.result.webcams[i].player.live.available === true) {
              var link = data.result.webcams[i].player.live.embed;
              $("#player").attr("src", link);
            }
            else{
            link = data.result.webcams[i].player.day.embed;
            $("#player").attr("src", link);
            sessionStorage.setItem("userLink", link);

          };
            var divLink = data.result.webcams[i].title;            
            $("<p>").text(divLink);
            $("#player" + i).text(divLink).css("backgroundColor", "#666666");
            $("#player" + i).text(divLink).css("color", "white");
            $("#player" + i).css("text-align", "center").css("margin", "8px");
            $("#player" + i).attr("link", link)
            $(document).on("click", "#player" + i, function () {
              var newLink = $(this).attr("link")
              console.log(newLink);
              $("#player").attr("src", newLink);
              userLinks.push(divLink);

            });
  
          };
        }
      });


    });

  });
}





