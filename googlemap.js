// JavaScript Document
function GoogleMap(){ 
this.initialize = function()
{
    var map = showMap();
    }  
    var showMap = function()
        {
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(11.031, 76.98),
            mapTypeId: google.maps.MapTypeId.ROADMAP
            } 
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions); 
        return map;
        }
}
