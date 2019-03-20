var map;
var marker;
var infowindow;
var messagewindow;
var newRow = $("<div class='row'>");

var config = {
  apiKey: "AIzaSyBRNkqdlrKBWMDm1zcDiwHi_OZdZ9TCIQo",
  authDomain: "group-project-tjm.firebaseapp.com",
  databaseURL: "https://group-project-tjm.firebaseio.com",
  projectId: "group-project-tjm",
  storageBucket: "group-project-tjm.appspot.com",
  messagingSenderId: "453175291790"
};
firebase.initializeApp(config);

var database = firebase.database();



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
    zoom: 9
  });
console.log(navigator) 
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
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
        `https://webcamstravel.p.mashape.com/webcams/list/nearby=${lat},${long},100/limit=18?show=webcams%3Aplayer%2Clocation&lang=en`;

      $.ajax({
        headers: {
          "X-Mashape-Key": "3765685265msh8f78976ecc9bc96p1993c5jsndd3be73bed11",
          "X-Mashape-Host": "webcamstravel.p.mashape.com"
        },
        url: queryURL,
        success: function (data) {
          console.log(data.result);
          $("#playerList").append(newRow);
          for (i = 0; i < data.result.webcams.length; i++) {
            $(".row").append($("<div>").attr("class", "col s1.5").attr("id", "player"+i));
            if(data.result.webcams[i].player.live.available===true){
              var link = data.result.webcams[i].player.live.embed;
              $("#player").attr("src", link);
            }
            link = data.result.webcams[i].player.day.embed;
            var divLink = data.result.webcams[i].title;

            $("<p>").text(data.result.webcams[i].title);
            $("#player"+i).text(divLink).css("backgroundColor", "#80deea");
            $("#player"+i).css("text-align", "center");
            $("#player"+i).css("margin", "8px");
            $("#player"+i).attr("link", link)
            $("#player").attr("src", link);
            $(document).on("click", "#player"+i, function(){
              var newLink = $(this).attr("link")
              console.log(newLink);
              $("#player").attr("src", newLink);

            });
            
          };
        }
      });


    });

  });
}





