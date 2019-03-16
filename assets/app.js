var map;
var marker;
var infowindow;
var messagewindow;



function initMap() {
  var california = { lat: 37.4419, lng: -122.1419 };
  map = new google.maps.Map(document.getElementById('map'), {
    center: california,
    zoom: 13
  });

  google.maps.event.addListener(map, 'click', function (event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });


    google.maps.event.addListener(marker, 'click', function () {
      console.log(event);
      var lat = event.pa.x;
      var long = event.pa.y;
      console.log(lat);
      console.log(long);

      var queryURL =
        `https://webcamstravel.p.mashape.com/webcams/list/nearby=${lat},${long},1000?show=webcams%3Aimage%2Clocation&lang=en`;
        
      $.ajax({
        headers: {
          "X-Mashape-Key": "3765685265msh8f78976ecc9bc96p1993c5jsndd3be73bed11",
          "X-Mashape-Host": "webcamstravel.p.mashape.com"
        },
        url: queryURL,
        success: function (data) {
          console.log(data);
        }
      });


    });

  });
}



