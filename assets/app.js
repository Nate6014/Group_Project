var map;
var marker;
var infowindow;
var messagewindow;


function addYourLocationButton (map, marker) 
{
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
                secondChild.style['background-position'] = imgX+'px 0';
            }, 500);

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
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
    zoom: 9
  });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

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

    google.maps.event.addListener(marker, 'click', function () {
      console.log(event);
      var lat = event.latLng.lat();
      var long = event.latLng.lng();
      console.log(lat);
      console.log(long);

      var queryURL =
        `https://webcamstravel.p.mashape.com/webcams/list/nearby=${lat},${long},10?show=webcams%3Aimage%2Clocation&lang=en`;
        
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



