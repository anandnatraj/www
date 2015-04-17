// JavaScript Document

	var app = {
    // Application Constructor
    initialize: function() {
        alert("Initialized ");
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
       // app.receivedEvent('deviceready');
       alert("on Device Ready");
       navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
    },
 
    onSuccess: function(position){
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        var latLong = new google.maps.LatLng(latitude, longitude);
        alert("on success ");
        var mapOptions = {
            center: latLong,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        alert("Before opening Map Long& /Lat "+longitude +" "+latitude);
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

//        google.maps.event.addDomListener(window, 'load', initialize);

        alert("After loaded ");
        var marker = new google.maps.Marker({
              position: latLong,
              map: map,
              title: 'my location'
          });
    },
    
    onError: function(error){
        alert("the code is " + error.code + ". \n" + "message: " + error.message);
    },
};

app.initialize();
