// JavaScript Document
//var _myApp = angular.module('_myApp', ['ngRoute','checklist-model']); why checklist-model is used ??

var _myApp = angular.module('_myApp', ['ngRoute','ngStorage']);

_myApp.factory('GlobalVariables', function() {

  
  return {
      baseUrl : 'http://h4u.ngrok.com',    // http://h4u.ngrok.com
      OPTIMALZOOM : 18,
      debugC : false,
      prodMode : true,
      deviceMode : true,
      addAnother : false
  };
});
_myApp.factory('AllValidations', function()
{
    var ErrorMsgs = [];
    ErrorMsgs['mobileNumberInvalidLength']=  {valid: false, msg :'Mobile number should be exactly 10 Digits'};
    ErrorMsgs['mobileNumberInvalid']=  {valid: false, msg :'Mobile number should be Numeric only'};
    ErrorMsgs['password']=      {valid: false, msg :'Password must be atleast 6 alphanumeric characters, without special characters'};
    ErrorMsgs['passwordTooLong'] =  {valid:false, msg:'Please restrict the password within 20 characters'};
    ErrorMsgs['confPassword']=  {valid: false, msg :'Confirm password must be same as Password'};
    ErrorMsgs['country']=       {valid: false, msg :'Country is must and cannot have any special or numeric characters'};
    ErrorMsgs['mustStringField']=   {valid: false, msg :'This field is must and cannot have any special or numeric characters'};
    ErrorMsgs['mustStringFieldTooLong']=   {valid: false, msg :'This field is must and cannot have any special or numeric characters'};
    ErrorMsgs['alphanumeric30']=   {valid: false, msg :'This field can have  30 valid characters only'};
    ErrorMsgs['idMax']=         {valid: false, msg :'ID should be maximum of 15 Characters'};
    ErrorMsgs['id']=            {valid: false, msg :'ID must be atleast 6 alphanumeric characters, without special characters'};
    
    var successMsg = {valid: true, msg:'Valid Input'};
    
    var allValidations = {};
    
    allValidations.compareAndReturnProfileObject = function(exso, newo)
    {
        var updObj = {};
        var newKeys = Object.keys(newo);
        newKeys.forEach(function(nk)
                        {
                            if (exso[nk] == null)
                            {
                                updObj[nk] = newo[nk];
                            }
                            else if (exso[nk] != newo[nk])
                            { 
                                updObj[nk] = newo[nk];
                            }
                        }
                       );
        return updObj;
    }
    
    allValidations.validMobileNumber = function(input,callback)
    {
        var mobileNumber = Number(input);
        
        var min = 1000000000;
        var max = 9999999999;
        var re = /[0-9]/;
        var validnum = re.test(input);
        
        var invalid = false;
        if (!validnum)
        {
            callback(ErrorMsgs['mobileNumberInvalid']);
        }
        else
        {
        var num = Number(input);    
        invalid = (num<min) || (num>max);
        console.log(num+' '+invalid);
        if (invalid)
            {
                 callback(ErrorMsgs['mobileNumberInvalidLength']);
            }
        else
            callback(successMsg);
        }
        
    }
    
    allValidations.validHighAddress = function(input, callback)
    {
        var regex = /[a-zA-Z\s]/;
        var valid = regex.test(input);
        if (valid)
        {
            if (input.length > 30)
                callback(ErrorMsgs['mustStringFieldTooLong']);
            else
                callback(successMsg);
        }
        else
            call(ErrorMsgs['mustStringField']);
    }
     
    allValidations.validPassword = function (input, callback)
    {
        var regex = /(?=.*\d)(?=.*[a-zA-Z])\w{6,}$/;
        var lengthy = false;
        var valid = regex.test(input);
        console.log(input +' '+valid);
        if (valid) 
            lengthy = (input.length >20);
        if (lengthy)
            callback(ErrorMsgs['passwordTooLong']);
        else if (valid)
            callback(successMsg);
        else
            callback(ErrorMsgs['password']);
    }
    allValidations.confPassword = function (pwd1, pwd2)
    {
        var eql = (pwd1 == pwd2);
        
        if (eql)
            return successMsg;
        else
            return(ErrorMsgs['confPassword']);
    };
    
    allValidations.validId = function(input, callback)
    {
       var regex = /(?=.*[a-zA-Z0-9])\w{6,}$/;
        var valid = regex.test(input);
        console.log(input +' '+valid);
        if (!valid)
            callback(ErrorMsgs['id']);
        else
        {
            if (input.length <= 15)
                callback(successMsg);
            else
                callback(ErrorMsgs['idMax']);
        }
    }
    
    return allValidations;
        
});
_myApp.factory('MapFunctions',function(){
    var mapFunctions = {};
    var map, insertMap;
    var currentPosition;
    var newCenter;
    var addressOfCenter = {};
    var OPTIMALZOOM = 18;
    var INSETMAPZOOMDIFF = 4;
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var insertMarker = null;
    mapFunctions.getMap = function()
    {
        return map;
    }
    mapFunctions.retrieveRoadMapBasedAddress = function(position, callback)
    {
        var latLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        directionsDisplay = new google.maps.DirectionsRenderer();
        var request = 
            {   origin:latLong,      
                destination:latLong,
                travelMode: google.maps.TravelMode.DRIVING
            };  
        directionsService.route(request, function(response, status) 
        {    
            if (status == google.maps.DirectionsStatus.OK) 
            {
                directionsDisplay.setDirections(response);
                var startAddress = directionsDisplay.getDirections().routes[0].legs[0].start_address;
                callback(startAddress);
            }  
        });
    }
    mapFunctions.retrieveAddressFromPosition = function(position,callback)
    {
        var geocoder = new google.maps.Geocoder();
        console.log('here in '+JSON.stringify(position));
        var latLong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        
        geocoder.geocode({'latLng': latLong}, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK)
                            {
                                if (results[1]) 
                                {
                                    callback(results);
                                } 
                                else 
                                {
                                    var errorMsg = 'No results found';
//                                    console.log(errorMsg);
                                    callback(errorMsg);
                                }
                            } 
                            else 
                            {
                                var errorMsg = 'Geocoder failed due to: ' + status;
//                                console.log(errorMsg);
                                callback(errorMsg);
                            }
                            });
    }
    
    function formAddressRoadMap(results)
    {
        var splitFields = results.split(',');
        if (splitFields.length>0)
        {
            var len = splitFields.length;
            
            addressOfCenter.lengthOfAddress = len;
            addressOfCenter.subUrbCityStateAndCountry = results;
            addressOfCenter.fullAddress = results;
            console.log("Through RoadMap : "+ JSON.stringify(addressOfCenter));
        }
    }
    
    function formAddress(results)
    {
        
        var lFields = results.length;
        if (lFields>0)
        {
            addressOfCenter.fullAddress = results[0].formatted_address;
            addressOfCenter.lengthOfAddress = lFields;
            addressOfCenter.subUrbCityStateAndCountry = results[lFields-4].formatted_address;
            console.log("Through Location : "+ JSON.stringify(addressOfCenter));
        }
    }
    
    
    mapFunctions.calcRoute = function (start, end) 
    {  
        
        var request = 
            {   origin:start,      
                destination:end,
                travelMode: google.maps.TravelMode.DRIVING
            };  
        directionsService.route(request, function(response, status) 
        {    
            if (status == google.maps.DirectionsStatus.OK) 
            {
                directionsDisplay.setDirections(response);
                var leg = directionsDisplay.getDirections().routes[0].legs[0];
                console.log("> "+leg.start_address);
            }  
        });
    }
    mapFunctions.panTo = function(position)
    {
        var lat = Number(0);
        var lon = Number(0);
        if (position != null)
        {
                lat = Number(position.latitude);
                lon = Number(position.longitude);
        }
        var center = new google.maps.LatLng(lat, lon);
        map.setZoom(OPTIMALZOOM);
        map.panTo(center);
        map.setCenter(center);
        insertMap.setCenter(newCenter);
        insertMap.setZoom(map.getZoom()-INSETMAPZOOMDIFF);
    }
    mapFunctions.initializeProfile = function(position, showMarker, mapel)
    {
        var lat = Number(position.latitude);
        var lon = Number(position.longitude);
        console.log('lMap'+lat+"lon "+lon);
         var mapOptions = {
                    zoom: 20,
                    center: position,
                    zoomControl: false,
                    streetViewControl: false,
                    panControl: false,
                    mapTypeControl: false
                    };
        var xmap = new google.maps.Map(document.getElementById(mapel), mapOptions);
        xmap.setMapTypeId(google.maps.MapTypeId.HYBRID) ;
        
        if (showMarker)
            {
                var marker = new google.maps.Marker(
                {
                        position: position,
                        map: xmap
                }
                );
            }
    }
    
    mapFunctions.initialize = function(position, showMarker, mapel, forDirection)
    {
            var lat = Number(0);
            var lon = Number(0);
            if (position != null)
            {
                lat = Number(position.latitude);
                lon = Number(position.longitude);
            }
            var mapOptions = {
                    zoom: 3,
                    center: new google.maps.LatLng(lat, lon),
                    zoomControl: false,
                    streetViewControl: false,
                    panControl: false,
                    mapTypeControl: false
                    };
            map = new google.maps.Map(document.getElementById(mapel), mapOptions);
        
            var insertMapOptions = {
                        zoom:1,
                        center: new google.maps.LatLng(lat, lon),
                        panControl: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        zoomControl: false
                    };
            map.setMapTypeId(google.maps.MapTypeId.HYBRID) ;
            
            if (!forDirection)
            {
                insertMap = new google.maps.Map(document.getElementById('inset-map-canvas'),insertMapOptions);
                insertMap.setZoom(OPTIMALZOOM-INSETMAPZOOMDIFF);
            }
            var location = {
                        coords:
                            {latitude:lat,
                             longitude:lon
                            }};
            
            newCenter = map.getCenter();
            if (showMarker)
            {
                var marker = new google.maps.Marker(
                {
                        position: new google.maps.LatLng(lat, lon),
                        map: map
                }
                );
            }
            /*mapFunctions.retrieveAddressFromPosition(location,function(results)What is this doing here ?
                        {
                                           
                            formAddress(results);
                        }
                ); */    
            if (forDirection)
            {
                map.setMapTypeId(google.maps.MapTypeId.ROADMAP) ;
                directionsDisplay = new google.maps.DirectionsRenderer();
                directionsDisplay.setMap(map);
                directionsDisplay.setPanel(document.getElementById('directions-panel'));
                
            }
            
            google.maps.event.addListener(map,'center_changed',function()
                                          {
                                              onMapListener(forDirection);
                                          });
        
            google.maps.event.addListener(map,'dragend' ,function() 
                                {
                                    onMapListener(forDirection);
                                });
            google.maps.event.addListener(map,'zoom_changed', function(){
                                    onMapListener(forDirection);
                                });
    }
    function onMapListener(forDirection)
    {
        newCenter = map.getCenter();
        
        if(!forDirection)
        {
            insertMap.setCenter(newCenter);
            insertMap.setZoom(map.getZoom()-INSETMAPZOOMDIFF);
            if (insertMarker != null)
                insertMarker.setMap(null);
            insertMarker = new google.maps.Marker(
                {
                        position: newCenter,
                        map: insertMap
                }
                );
        }
        
                var newCenterCoord = { //Very strange .. Dont know why
                     coords:
                            {
                            latitude: newCenter.k,
                            longitude: newCenter.D
                            }};
                window.setTimeout(function()
                                  {
                                    mapFunctions.retrieveRoadMapBasedAddress(newCenterCoord, function(results)
                                    {
                                        if (results != null && (results.split(',').length>0))
                                        {
                                            formAddressRoadMap(results);    
                                        }
//                                        else
                                        {
                                            mapFunctions.retrieveAddressFromPosition(newCenterCoord, function(results)
                                            {
                                            if (typeof results === 'object')
                                                        formAddress(results);
                                            
                                            }
                                            );
                                        }
                                    }
                                    );
                                  },100);
    }
    mapFunctions.getAddressOfCenter = function()
    {
        return addressOfCenter;
    }
    mapFunctions.getCenter = function()
    {
        return map.getCenter();
    }
    mapFunctions.zoomOut = function()
    {
        var exZ = map.getZoom();
        if (exZ > 0)
            map.setZoom(exZ-1);
    }
    mapFunctions.zoomIn = function()
    {
        var exZ = map.getZoom();
        if (exZ <= 20)
            map.setZoom(exZ+1);
    }
    mapFunctions.getCurrentLocation = function(moveToCurrent, latest, callback)
    {
        var mCache = 5000;
        if (latest)
            mCache = 0;
        var posOptions = {timeout:10000, enableHighAccuracy: true, maximumAge:mCache};
        navigator.geolocation.getCurrentPosition(onsuccess,onError,posOptions);
        
        function onsuccess(position)
        {
            currentPosition = position;
            var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
//            console.log(pos);
            if (moveToCurrent)
            {
                map.setCenter(pos);
            }
            callback(position);
            
        }
        function onError(error)
        {
            
        }
    }
    return mapFunctions;
    
});
_myApp.factory('testVariables', function() {
    var testRegisters = [];
    var testFunctions = {};
    
    var t1 = {
            "_id" : 70852,
            "mobileNumber" : 3532009295,
            "deviceDetails" : {
                "uuid" : "3epa8hop",
                "platform" : "android"
            },
            "latitude" : 10.25659410481267,
            "longitude" : 77.16212365831248,
            "locId" : "000jlpx5cg",
            "addressline1" : "323e",
            "addressline2" : "dsfdfdfdsfdsf",
            "suburb" : "CBEanf",
            "city" : "Coimbatore",
            "state" : " Tamil Nadu",
            "securityLevel" : "protected",
            "uuid" : "3epa8hop",
            "createdDate" : ("2015-04-01T05:21:24.551Z")
             };
    testRegisters.push(t1);
    t1 = {
            "_id" : 82850,
            "mobileNumber" : 2517850812,
            "deviceDetails" : {
            "uuid" : "vliugvk0",
                "platform" : "android"
            },
            "latitude" : 10.03678125667311,
            "longitude" : 77.66114838173613,
            "locId" : "0002g778nb",
            "addressline1" : "323e",
            "addressline2" : "dsfdfdfdsfdsf",
            "suburb" : "CBEpo0",
            "city" : "Coimbatore",
            "state" : " Tamil Nadu",
            "securityLevel" : "protected",
            "uuid" : "vliugvk0"
             };
    testRegisters.push(t1);
    t1= {
    "_id" : 51343,
    "mobileNumber" : 4151263205,
    "deviceDetails" : {
        "uuid" : "i567z1a6",
        "platform" : "android"
    },
    "latitude" : 10.5059807841938,
    "longitude" : 77.12320204343646,
    "locId" : "00046q3vkn",
    "addressline1" : "323e",
    "addressline2" : "dsfdfdfdsfdsf",
    "suburb" : "CBEh9q",
    "city" : "Coimbatore",
    "state" : " Tamil Nadu",
    "securityLevel" : "protected",
    "uuid" : "i567z1a6",
    "createdDate" : ("2015-04-01T05:21:05.106Z")
    }
    testRegisters.push(t1);
    
    testFunctions.testRegistration = function(regObj)
    {
            testRegisters.push(regObj);
            
    };
    testFunctions.isIdAvailable = function(plocId)
    {
        var regIds = testRegisters.filter(function(eachReg)
         {
             return ((eachReg.locId == plocId));
         });
        return (regIds.length == 0);
    }
    testFunctions.isDeviceRegistered = function (pObject)
    {
            var filtereddevices = testRegisters.filter(function(eachDevice)
            {
                return (eachDevice.deviceDetails.uuid == (pObject.uuid));
            }
            );
        return (filtereddevices.length>0);
    };
    
    testFunctions.getAllRegistrations = function()
    {
        return testRegisters;
    };
    
    testFunctions.searchById  = function(filterObj)
    {
        var searchResult = testRegisters.filter(function(eachR)
            {
                
                return (eachR.locId.indexOf(filterObj.qry,0) !=-1);
            }
            );
        return searchResult;
    };
 
    return testFunctions; // This is must. Dont Remove
});

_myApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/landing', {
				templateUrl : 'myAppPages/landingPage.html',
				controller  : 'landingPageController'
			})
            .when('/', {
				templateUrl : 'myAppPages/centerTest.html',
				controller  : 'testController'
			})
            /*.when('/landing/:pObject', {
				templateUrl : 'myAppPages/landingPage.html',
				controller  : 'landingPageController'
			})*/
            .when('/regDetails/:registerDetails', {
				templateUrl : 'myAppPages/registerDetailsPage.html',
				controller  : 'registrationController'
			})
			.when('/regDetails', {
				templateUrl : 'myAppPages/registerDetailsPage.html',
				controller  : 'registrationController'
			})
			/*.when('/firstPage/:pObject', {
				templateUrl : 'myAppPages/firstPage.html',
				controller  : 'firstPageController'
			})
            .when('/firstPage', {
				templateUrl : 'myAppPages/firstPage.html',
				controller  : 'firstPageController'
			})*/
            .when('/search', {
				templateUrl : 'myAppPages/searchResultsPage.html',
				controller  : 'searchResultsController'
			})
			.when('/search/:searchObj', {
				templateUrl : 'myAppPages/searchResultsPage.html',
				controller  : 'searchResultsController'
			})
			.when('/mobilePassword/:pObject', {
				templateUrl : 'myAppPages/mobileNumbPassword.html',
				controller  : 'mobilePasswordController'
			})
		  .when('/mobilePassword', {
				templateUrl : 'myAppPages/mobileNumbPassword.html',
				controller  : 'mobilePasswordController'
			})	
            .when('/errorPage/:errorDetails', {
				templateUrl : 'myAppPages/searchResultsPage.html',
				controller  : 'searchResultsController'
			})
			.when('/map/:pObject', {
				templateUrl : 'myAppPages/mapVPage.html',
				controller  : 'mapController'
			})
            .when('/map', {
				templateUrl : 'myAppPages/mapVPage.html',
				controller  : 'mapController'
			})
            .when('/searchMap/:pObject', {
				templateUrl : 'myAppPages/searchMapPage.html',
				controller  : 'mapSearchController'
			})
            .when('/profilePage', {
				templateUrl : 'myAppPages/profilePage.html',
				controller  : 'profileController'
			})
            .when('/editLocation', {
				templateUrl : 'myAppPages/mapVPage.html',
				controller  : 'editLocationController'
			})
            .when('/successRegistration/:pObject', {
				templateUrl : 'myAppPages/successRegistration.html',
				controller  : 'successRegistrationController'
			});
	});

_myApp.controller('editLocationController',['$scope', '$http', '$routeParams', '$location', 'GlobalVariables', 'MapFunctions', '$localStorage', 'AllValidations', function($scope,$http,$routeparams,$location,GlobalVariables,MapFunctions,$localStorage,AllValidations)
{
    
    MapFunctions.initialize(null,false,'map-canvas',false);
    $scope.newAddress = "New ";
    MapFunctions.getCurrentLocation(false, true,function(currPosition)
                                               {
                                                    retPosition = currPosition;
                                                    console.log(currPosition);
                                                    var pObject = {};
                                                    pObject.latitude = currPosition.coords.latitude;
                                                    pObject.longitude = currPosition.coords.longitude;
                                                    MapFunctions.panTo(pObject);
                                            });
    $scope.zoomOut = function()
    {
        MapFunctions.zoomOut();
    }
    $scope.zoomIn = function()
    {
        MapFunctions.zoomIn();
    }
    $scope.showCurrentPosition = function()
    {
        MapFunctions.getCurrentLocation(true, true, function(){});
    }
    
    $scope.saveSelection = function()
    {
            var position = MapFunctions.getCenter();
//            console.log(JSON.stringify(position));
            var onlyMarker = {};
            onlyMarker.latitude = position.k; // Not sure why this is this way.
            onlyMarker.longitude = position.D;
            $localStorage.chosenAddress = {
                                            address1: $scope.address1,
                                            address2: $scope.address2,
                                            suburb: $scope.suburb,
                                            city: $scope.city,
                                            state: $scope.state,
                                            country: $scope.country,
                                            pinZipCode: $scope.pinZipCode
                                            };
            
            $localStorage.chosenLocation = onlyMarker;
            var updDoc = formUpdateDoc(onlyMarker);
        
            var pObject = {objectToUpdate:updDoc};
            $scope.showHideProgr = true;
            $http({
                    method:'PUT',
                    headers: {'Content-Type': 'application/json'},
                    url :GlobalVariables.baseUrl + '/updateProfile',
                    data : pObject
                    })
                    .success(function(data, status, header, config)
                    {
                        console.log("Success Update "+JSON.stringify(data));
                        if (data.response.length == 0)
                        {
                               $location.path('/error');
                        }
                        else
                        {
    //                            $scope.showHideProgr = false;
                                $scope.updateStatus = 'Updated....';
                                $localStorage.registerAdds = data.response; // Assumed to have currently one...
                                $scope.showBack = true;
                                $location.path('/profilePage');
                        }
                    })
                    .error(function (data,status, header,config)
                    {
                        console.log('Everyone will fail to see what they wanted!');
                        $scope.monthsToChoose = [{"yyyymm":"201507","MON_YYYY":"Jul 2015"}];
                     });
    }
    function formUpdateDoc(latlon)
    {
        var doc = {};
        var exReg = $localStorage.registerAdds;
        var registration = exReg[0];    // Assuming only one registration
        var scopeObj =
            {
                addressline1: $scope.address1,
                addressline2: $scope.address2,
                suburb:  $scope.suburb,
                city:$scope.city,
                state: $scope.state,
                pinZipCode: $scope.pinZipCode,
                country: $scope.country,
                latitude: latlon.latitude,
                longitude: latlon.longitude
            };
        doc = AllValidations.compareAndReturnProfileObject(registration,scopeObj);
        
        doc.pk = registration._id;
        
        return doc;
    }
    
    $scope.setAddressInfo =function()
    {
        
        var address = MapFunctions.getAddressOfCenter();
        console.log('On Opening modal Dialogue '+address);
        if (address != null)
            {
                    var jAddress = {};
                    if (typeof   address === 'string')
                    {
                         jAddress = JSON.parse(address);
                    }
                    else if (typeof address === 'object')
                    {
                        jAddress = address;
                    }

                    var splitAddress = jAddress.fullAddress.split(',');
                    if (splitAddress.length >= 3)
                    {
                    $scope.country=splitAddress[splitAddress.length-1];       
                    $scope.state=splitAddress[splitAddress.length-2];
                    $scope.city=splitAddress[splitAddress.length-3];
                    }
                    if (splitAddress.length >= 4)
                    {
                        $scope.suburb=splitAddress[splitAddress.length-4];;
                    }
                    if (splitAddress.length >= 5)
                    {
                        $scope.address2=splitAddress[splitAddress.length-5];;
                    }
            }
    }
}
]);                                      
_myApp.controller('profileController',['$scope', '$http', '$routeParams', '$location', 'GlobalVariables', 'MapFunctions', '$localStorage', 'AllValidations' , function($scope,$http,$routeparams,$location,GlobalVariables,MapFunctions,$localStorage,AllValidations)
{
    var exReg = $localStorage.registerAdds;
    $scope.showHideProgr = false;$scope.updateStatus = 'Updating Details...';
    $scope.showBack = false;
    exReg.forEach(function(reg)
                  {
                      console.log(reg);
                  });
    // Assuming only one now:
    var registration = exReg[0];
    $scope.address1 = registration.addressline1;
    $scope.address2 = registration.addressline2;
    $scope.suburb = registration.suburb;
    $scope.city = registration.city;
    $scope.state = registration.state;
    $scope.pinZipCode = registration.pinZipCode;
    $scope.country = registration.country;
    var position = new google.maps.LatLng(registration.latitude, registration.longitude);
    MapFunctions.initializeProfile(position,true,'profileMap');
    
    var exSe = registration.securityLevel;
    var elmnt = document.getElementById(exSe);
    var baseClass = elmnt.className;
    elmnt.className = baseClass +' disabled';
    
        $scope.toggle = function(elmntId)    
        {
            $scope.pbldisabled = 'disabled';
            $scope.prtdisabled = 'disabled';
            var elmnt = document.getElementById(elmntId);
            var baseClass = elmnt.className;
            $scope.seclevelTxt = '';
            if (elmntId == 'Public')
            {
                document.getElementById('Protected').className = baseClass;
                elmnt.className = baseClass +' disabled';
                $scope.seclevelTxt = 'Increases Publicity; others can search you by your Id or by your mobile number';
                $scope.seclevl = 'Public';
            }
            if (elmntId == 'Protected')
            {
                document.getElementById('Public').className = baseClass;
                elmnt.className = baseClass +' disabled';
                $scope.seclevelTxt = 'Limited Publicity; Others can search you only by your Id,  not by your mobile number';
                $scope.seclevl = 'Protected';
            }

        }
    
    function formUpdateDoc()
    {
        var doc = {};
        var scopeObj =
            {
                addressline1: $scope.address1,
                addressline2: $scope.address2,
                suburb:  $scope.suburb,
                city:$scope.city,
                state: $scope.state,
                pinZipCode: $scope.pinZipCode,
                country: $scope.country,
                securityLevel: $scope.seclevl
            };
        doc = AllValidations.compareAndReturnProfileObject(registration,scopeObj);
        
        doc.pk = registration._id;
        
        return doc;
    }
    $scope.updateDetailsAlone = function()
    {
        var updDoc = formUpdateDoc();
        var pObject = {objectToUpdate:updDoc};
        $scope.showHideProgr = true;
        $http({
                method:'PUT',
                headers: {'Content-Type': 'application/json'},
                url :GlobalVariables.baseUrl + '/updateProfile',
                data : pObject
                })
                .success(function(data, status, header, config)
                {
                    console.log("Success Update "+JSON.stringify(data));
                    if (data.response.length == 0)
                    {
                           $location.path('/error');
                    }
                    else
                    {
//                            $scope.showHideProgr = false;
                            $scope.updateStatus = 'Updated....';
                            $localStorage.registerAdds = data.response; // Assumed to have currently one...
                            $scope.showBack = true;
                            $location.path('/profilePage');
                    }
                })
                .error(function (data,status, header,config)
                {
                    console.log('Everyone will fail to see what they wanted!');
                    $scope.monthsToChoose = [{"yyyymm":"201507","MON_YYYY":"Jul 2015"}];
                 });
        
    }
    $scope.editLocation = function()
    {
        $location.path('/editLocation');
    }
    $scope.goToSearch = function()
    {
        $location.path('/landing');
    }
}
]);                                       

_myApp.controller('mapSearchController',['$scope', '$http', '$routeParams', '$location', 'GlobalVariables', 'MapFunctions', function($scope,$http,$routeparams,$location,GlobalVariables,MapFunctions)
{
    var map;
    var currLocation = {};
    $scope.zoomOut = function()
    {
        MapFunctions.zoomOut();
    }
    $scope.zoomIn = function()
    {
        MapFunctions.zoomIn();
    }
    
    if ($routeparams.pObject != undefined)
    {
        var pObject = JSON.parse($routeparams.pObject);
        console.log(pObject);

        MapFunctions.getCurrentLocation(false, true, function(location)
                                       {
                                          currLocation.latitude  = location.coords.latitude; 
                                          currLocation.longitude  = location.coords.longitude;    
                                          MapFunctions.initialize(currLocation,false,'map-canvas',true);
                                          var start = new google.maps.LatLng(currLocation.latitude, currLocation.longitude);
                                          var end =   new google.maps.LatLng(pObject.latitude, pObject.longitude);
                                            MapFunctions.calcRoute(start,end);
                                       });
    }
}
]);
_myApp.controller('testController',['$scope', '$http', '$routeParams', '$location', 'GlobalVariables', 'MapFunctions','AllValidations' , function($scope,$http,$routeparams,$location,GlobalVariables,MapFunctions, AllValidations)
{
    $scope.appValidate = function()
    {
        console.log('called appValidate');
        AllValidations.validMobileNumber($scope.phNumber,function(valid)
                                         {
                                             $scope.validphnum = valid;
                                         });
        AllValidations.validPassword($scope.pwd, function(valid)
                                     {
                                         $scope.validpwd = valid;
                                     });
        $scope.validcpwd = AllValidations.confPassword($scope.pwd,$scope.cpwd);
        AllValidations.validId($scope.locId, function(valid)
                               {
                                         $scope.validid = valid;
                                    });
        AllValidations.validHighAddress($scope.address, function(valid)
                                        {
                                            $scope.validAHighAddress = valid;
                                        });
    }
    
    $scope.testAtController = function()
    {
        console.log($scope.someid);
    }
    $scope.openTest = function()
    {
        GlobalVariables.prodMode = false;
        $location.path('/landing');
    }
    $scope.openProd = function()
    {
        GlobalVariables.prodMode = true;
        $location.path('/landing');
    }

}
]);
_myApp.controller('successRegistrationController',['$scope', '$http', '$routeParams', '$location', 'GlobalVariables', 'MapFunctions', '$localStorage', function($scope,$http,$routeparams,$location,GlobalVariables,MapFunctions, $localStorage)
{
    if ($routeparams.pObject != undefined)
    {
        var pObject = JSON.parse($routeparams.pObject);
        //this is test
        console.log("Passed to Success Page "+JSON.stringify(pObject));
        
        var xsistingR = $localStorage.registerAdds;
            
        if (xsistingR == undefined || xsistingR == null) xsistingR = [];
        
        xsistingR.push(pObject);
        
        $localStorage.registerAdds = xsistingR;
        console.log(">> After saving "+$localStorage.registerAdds);
        $scope.regId = pObject.locId;
        $scope.addressline1 = pObject.addressline1;
        $scope.addressline2 = pObject.addressline2;
        $scope.suburb = pObject.suburb;
        $scope.city = pObject.city;
        $scope.state = pObject.state;
        $scope.country = pObject.country;
        var seclvl = pObject.securityLevel;
        $scope.askAdditionalTag = false;
        if (seclvl == 'Public')
        {
            $scope.askAdditionalTag = true;
        }
        //
    }
    $scope.goToSearch = function()
    {
        $location.path('/landing');
    }
}
]);
_myApp.controller('landingPageController', ['$scope','$http','$routeParams','$location','GlobalVariables', 'testVariables', 'MapFunctions',   '$localStorage', function($scope,$http,$routeparams,$location,GlobalVariables,testVariables,MapFunctions, $localStorage) 
    {
    var anotherReg = false;
    var addressDetails;
    var deviceInfo = {
                            uuid: 'mydeviceId',
                            platform: 'android'
                            }; 
    if (GlobalVariables.deviceMode )
            deviceInfo = (device);
    if ($routeparams.pObject != undefined)
    {
        var pObject = JSON.parse($routeparams.pObject);
        anotherReg = pObject.anotherRegistraion;
    }
    if ($localStorage.deviceInfo == undefined)
            $localStorage.deviceInfo = deviceInfo;
        
    MapFunctions.getCurrentLocation(false, true,function(location)
                                           {
                                               $localStorage.startupLocation = location;
                                               MapFunctions.retrieveRoadMapBasedAddress(location, function(addressStr)
                                                {
                                                    var addFieldsCnt = addressStr.split(',').length;
                                                    $scope.SCSC = addressStr;
                                                    if (addFieldsCnt == 0)
                                                    {
                                                        MapFunctions.retrieveAddressFromPosition(location, function(results)
                                                        {
                                                            var startupAddress = results[1].formatted_address;
                                                            console.log('At landing Page Controller > '+startupAddress);
                                                            $localStorage.startupAddress = startupAddress;
                                                            $scope.SCSC = startupAddress;
                                                            routeTo();
                                                        }
                                                        );
                                                    }
                                                    else
                                                    {
                                                        $localStorage.startupAddress = addressStr;
                                                        routeTo();
                                                    }
                                                }
                                                );
                                           });  
    function routeTo()
    {
        $scope.subUrbCityStateAndCountry = $scope.SCSC;
        
        if (GlobalVariables.prodMode)
                onProd();
        else
                onTest();
    }
        
    function onTest()
    {
          var pObject = {};
        pObject['deviceDetails'] = deviceInfo;
        var toPath;
        console.log('>>> '+$scope.subUrbCityStateAndCountry);
        var isRegistered = false;
        if ($localStorage.testRegistration != undefined)
        {
            isRegistered = ($localStorage.testRegistration.deviceDetails.uuid == deviceInfo.uuid);
        }
        
        if (isRegistered && !(anotherReg))
        {
            console.log('going for search '+$scope.subUrbCityStateAndCountry);
            toPath ='/search';
        }
        else
        {
            console.log('going for firstPage '+$scope.subUrbCityStateAndCountry);
//            toPath = '/firstPage/'+JSON.stringify(pObject);
            toPath = '/map';
            
        }
        $scope.$apply(function()
                              {
                                  $location.path(toPath);
                              });
    }
    function onProd()
    {
        
        var pObject = {};
        pObject['deviceDetails'] = deviceInfo;
        if ($localStorage.registerdAdds == undefined)
        {
            $http({
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                url :GlobalVariables.baseUrl + '/isDeviceRegistered',
                data : pObject
                })
                .success(function(data, status, header, config)
                {
                    console.log("Success "+JSON.stringify(data));
                    if (data.response.length == 0 || (anotherReg))
                    {
                           $location.path('/map');
                    }
                    else
                    {
                        $localStorage.registerAdds = data.response; // Assumed to have currently one...
                        $location.path('/search');
                    }
                })
                .error(function (data,status, header,config)
                {
                    console.log('Everyone will fail to see what they wanted!');
                    $scope.monthsToChoose = [{"yyyymm":"201507","MON_YYYY":"Jul 2015"}];
                 }); 
        }
        else
        {
            $location.path('/search');
        }
    }
        
    }
]);
_myApp.controller('mobilePasswordController', ['$scope','$http','$routeParams','$location', 'GlobalVariables', '$localStorage', 'MapFunctions', function($scope,$http,$routeparams,$location,GlobalVariables,$localStorage,MapFunctions) 
{
    $scope.debug = GlobalVariables.debugC;
    var pObject={};
    var startupAddress = $localStorage.startupAddress;
    var chosenLocation = $localStorage.chosenLocation;
    var position = new google.maps.LatLng(chosenLocation.latitude, chosenLocation.longitude);
    MapFunctions.initializeProfile(position,true,'profileMap');
    
    if (startupAddress != null)
    {
        var splitAddress = startupAddress.split(',');
        var len = splitAddress.length;
        if (len > 0)
        {
            $scope.country = splitAddress[len-1];
            $scope.country = ($scope.country).trim();
             var responsePromise = $http.get(GlobalVariables.baseUrl+"/getISDCode?country="+$scope.country);

                responsePromise.success(function(data, status, headers, config) {
                    console.log((data));
                    $scope.country = (data.response[0]).code;
                });
                responsePromise.error(function(data, status, headers, config) {
//                    alert("Unable to get failed!");
                    $scope.country = '0000';
                });
        }
        else
            {
                // do something
            }
    }
    var submitButton = document.getElementById('savebutton');
    var baseClassName = submitButton.className;
    submitButton.className = baseClassName + ' disabled';
    $scope.backToMap = function()
    {
        $location.path('/map');
    }
    
    function validateInputFields()
    {
        return true;
    }
    $scope.accepted = function()
    {
        if ($scope.acceptance && validateInputFields())
        {
            submitButton.className = baseClassName;
        }
        else
        {
            submitButton.className = baseClassName + ' disabled';
        }
    }   
    $scope.goToMapPage = function()
        {
            pObject['mobileNumber'] = $scope.mobNumber;
            pObject['sPin'] = $scope.sPin;
            $localStorage.mobilePassword = 
                {
                    mobileNumber: $scope.mobNumber,
                    sPin : $scope.sPin
                };
            $location.path('/regDetails');
        }
    }
]);
_myApp.controller('firstPageController', ['$scope','$http','$routeParams','$location','GlobalVariables', 'MapFunctions', '$localStorage',  function($scope,$http,$routeparams,$location,GlobalVariables,MapFunctions,$localStorage) 
    {
    $scope.debug = GlobalVariables.debugC;
    console.log('have i come here');
    var positionGot = false;
    $scope.deviceDetails = {};
    if ($routeparams.pObject != undefined)
    {
        pObject = JSON.parse($routeparams.pObject);
        if (typeof pObject.deviceDetails == 'string')
        {
        $scope.deviceDetails = JSON.parse(pObject.deviceDetails); 
        }
        else if (typeof pObject.deviceDetails == 'object')
        {
            $scope.deviceDetails = pObject.deviceDetails;
        }
    }
    
    $scope.country = '';    
    $scope.stateAndCountry = '';
    $scope.city = '';
    var passObject = {id:2};
    var jo =  {uuid:'mydeviceId',platform:'android'};
    if (GlobalVariables.deviceMode) 
        {
            jo =  JSON.stringify(device);
            passObject['deviceDetails'] = (jo);
        }
    
    $scope.showHide = true;  
    var cnt = 0;
    
    function readFromLocalStorage()
    {
        var startUpAddress = $localStorage.startupAddress;
        console.log("Thru LocalStorage >>"+startUpAddress);
        
        var fullAddress =  startUpAddress;
        console.log('full address :'+ fullAddress);
        var splitAddress = fullAddress.split(',');
        $scope.lengthOfAddress = splitAddress.length;
        if (splitAddress.length >= 4)
        {
                                                    $scope.country= splitAddress[splitAddress.length-1];       
                                                    $scope.state= splitAddress[splitAddress.length-2];
                                                    $scope.city= splitAddress[splitAddress.length-3];
                                                    $scope.suburb= splitAddress[splitAddress.length-4];;
                                                    $scope.showHide = false;
                                                    var clName = document.getElementById('savebutton').className; 
                                                    var iDis = clName.indexOf('disabled');
                                                    $scope.cityStateAndCountry = startUpAddress;
                                                    clName = clName.substring(0,iDis);
                                                    document.getElementById('savebutton').className = clName;    
                                                        
        }
    }
    
    readFromLocalStorage();
  
    var someAssignment = $scope.firstPageContent;
    $scope.goToPhonePage = function() // Test function
    {
        passObject['addressDetails'] = {
                                        totalAddElements: $scope.lengthOfAddress,
                                        city: $scope.cityStateAndCountry,
                                        country: $scope.country
                                        //fullAddress: $scope.firstPageContent
                                        };
        $location.path('/mobilePassword/'+JSON.stringify(passObject));
    }
    }
]);
_myApp.controller('registrationController', ['$scope','$http','$routeParams','$location','GlobalVariables', 'testVariables', '$localStorage', function($scope,$http,$routeparams,$location,GlobalVariables, testVariables, $localStorage) 
    {
        $scope.debug = GlobalVariables.debugC;
        $scope.fullDetails = {};
        var regDetails = {};
        $scope.resultGot = false;
        var idAvailableStatus = 
            {
                empty: '',
                checking: 'Checking Id availability. Please wait',
                available: ' is available, and temporarily blocked for you 180 seconds',
                notavailable: ' is not available, please try someother combination',
                unknownerror : 'Unknow error occurred, requesting you to retry'
            };
        $scope.idAvailableStatus =idAvailableStatus.empty;
        $scope.seclevel = 'Public';
        $scope.toggle = function(elmntId)    
        {
            $scope.pbldisabled = 'disabled';
            $scope.prtdisabled = 'disabled';
            var elmnt = document.getElementById(elmntId);
            var baseClass = elmnt.className;
            $scope.seclevelTxt = '';
            if (elmntId == 'Public')
            {
                document.getElementById('Protected').className = baseClass;
                elmnt.className = baseClass +' disabled';
                $scope.seclevelTxt = 'Increases Publicity; others can search you by your Id or by your mobile number';
                $scope.seclevl = 'Public';
            }
            if (elmntId == 'Protected')
            {
                document.getElementById('Public').className = baseClass;
                elmnt.className = baseClass +' disabled';
                $scope.seclevelTxt = 'Limited Publicity; Others can search you only by your Id,  not by your mobile number';
                $scope.seclevl = 'Protected';
            }

        }
        $scope.checkAvailability = function()
        {
//            console.log('called only .. after...');
                var uuid = $localStorage.deviceInfo.uuid;
                var locId =  $scope.rDesiredId;
                var data = {prefOption:{prefId:locId,uuid:uuid}};
                $scope.resultGot = true;
                $scope.idAvailableStatus = idAvailableStatus.checking;
                document.getElementById('idStatus').className = 'text-primary';
            
                $http({
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                url :GlobalVariables.baseUrl + '/isIdAvailable',
                data : data
                })
                .success(function(data, status, header, config)
                {
                    successCallback(data, status, header, config)
                })
                .error(function (data,status, header,config)
                {
                    errorCallback(data, status, header, config)
                });   
            
            
                function successCallback(data, status, headers, config)
                {
                    var response = data.response;
                    console.log('\n'+JSON.stringify(response)+'\n');
                    if (response.length > 0)
                    {    
                        if(response[0].status == undefined)
                        {
                            $scope.idAvailableStatus = idAvailableStatus.unknownerror;
                            document.getElementById('idStatus').className = 'text-danger';
                        }
                        else if (response[0].status == 'RS')
                        {
                            $scope.idAvailableStatus = locId + idAvailableStatus.available;
                            document.getElementById('idStatus').className = 'text-success';
                        }
                    }
                    else
                    {
                        $scope.idAvailableStatus = locId + idAvailableStatus.notavailable;
                        document.getElementById('idStatus').className = 'text-warning';
                    }
                }
        
                function errorCallback(data, status, headers, config)
                {
                    console.log(">>> Error >>> "+JSON.stringify(data));
                }
        }
        
        
       $scope.submitFunction = function()
        {
           console.log('Before submission ' +$scope.seclevel);
           var vObjectToInsert = 
            {
                mobileNumber:$localStorage.mobilePassword.mobileNumber,
                sPin: $localStorage.mobilePassword.sPin,
                deviceDetails: $localStorage.deviceInfo,
                latitude: $localStorage.chosenLocation.latitude,
                longitude: $localStorage.chosenLocation.longitude,
                locId: $scope.rDesiredId,
                addressline1:$localStorage.chosenAddress.address1,
                addressline2:$localStorage.chosenAddress.address2,
                suburb:$localStorage.chosenAddress.suburb,
                city:$localStorage.chosenAddress.city,
                state:$localStorage.chosenAddress.state,
                country: $localStorage.chosenAddress.country,
                pinZipCode : $localStorage.chosenAddress.pinZipCode,
                securityLevel: $scope.seclevel
            };
            var passObject = {};
            passObject.objectToInsert = vObjectToInsert;
            console.log("Have i set >> "+GlobalVariables.prodMode);
            if (GlobalVariables.prodMode)
            {
                serverCall(passObject);
            }
            else
            {
//                console.log("Pre "+testVariables.getAllRegistrations().length);
                testVariables.testRegistration(passObject.objectToInsert);
                $localStorage.testRegistration =(passObject.objectToInsert);
//                console.log("Post "+testVariables.getAllRegistrations().length);
                $location.path('/successRegistration/'+JSON.stringify(passObject.objectToInsert));
            }
        }
       
        function serverCall(passObject)
        {
            
            $http({
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                url :GlobalVariables.baseUrl + '/registerProfile',
                data : passObject
                })
                .success(function(data, status, header, config)
                {
                    console.log("Success "+JSON.stringify(data.response[0]));
                    $location.path('/successRegistration/'+JSON.stringify(data.response[0]));
                })
                .error(function (data,status, header,config)
                {
                    console.log('Everyone will fail to see what they wanted!'+data.error);
                });   
        }
       
    }
]);
_myApp.controller('contactController', ['$scope','$http','$routeParams','$location',function($scope,$http,$routeparams,$location)
    {
        
    
    }
]);

_myApp.controller('mapController', ['$scope','$http','$routeParams','$location', 'GlobalVariables' ,'MapFunctions' , '$localStorage', function($scope,$http,$routeparams,$location,GlobalVariables,MapFunctions, $localStorage) 
    {
    $scope.debug = GlobalVariables.debugC;  
    var lMap;
    var ourMarkers =[];
    var onlyMarker = {};
    var panTo;;
    var attempt = 0;
    var OPTIMALZOOM = GlobalVariables.OPTIMALZOOM;
    var cntAtt = 2;
    var device = false; // false
    var loadedRightPosition = false;
    var infowindow;
    
    
    
    if (GlobalVariables.prodMode)
    {
        initialize();
    }
    else
    {
        initialize();
    }
    function initialize()
        {
            var retPosition;
            MapFunctions.initialize(null,false,'map-canvas',false);
            MapFunctions.getCurrentLocation(false, true,function(currPosition)
                                               {
                                                    retPosition = currPosition;
                                                    console.log(currPosition);
                                                    var pObject = {};
                                                    pObject.latitude = currPosition.coords.latitude;
                                                    pObject.longitude = currPosition.coords.longitude;
                                                    MapFunctions.panTo(pObject);
                                               });
        }
    $scope.zoomOut = function()
    {
        MapFunctions.zoomOut();
    }
    $scope.zoomIn = function()
    {
        MapFunctions.zoomIn();
    }
    $scope.showCurrentPosition = function()
    {
        MapFunctions.getCurrentLocation(true, true, onSuccess);
    }
    
   
        
    //
    function setAllMap(vmap) {
    for (var i = 0; i < ourMarkers.length; i++) 
        {
            ourMarkers[i].setMap(vmap);
        }
    }
    function retrieveAddressFromPosition(onlyMarker,callback)
    {
        var geocoder = new google.maps.Geocoder();
        var latLong = new google.maps.LatLng(onlyMarker.latitude, onlyMarker.longitude);

        geocoder.geocode({'latLng': latLong}, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) 
                            {
                                if (results[1]) 
                                {
                                    callback(results);
                                } 
                                else 
                                {
                                    $scope.firstPageContent = 'No results found';
                                }
                            } 
                            else 
                            {
                                $scope.firstPageContent = 'Geocoder failed due to: ' + status;
                            }
                            });
    }    
    var onSuccess = function (position)
    {
            var longitude = position.coords.longitude;
            var latitude = position.coords.latitude;
            setAllMap(null);
            var latLong = new google.maps.LatLng(latitude, longitude);
            panTo = latLong;
    }
    var onError=function(error)
    {
        $scope.message=("the code is " + error.code + ". \n" + "message: " + error.message);
    }
    $scope.setAddressInfo =function()
    {
        
        var address = MapFunctions.getAddressOfCenter();
        console.log('On Opening modal Dialogue '+address);
        if (address != null)
            {
                    var jAddress = {};
                    if (typeof   address === 'string')
                    {
                         jAddress = JSON.parse(address);
                    }
                    else if (typeof address === 'object')
                    {
                        jAddress = address;
                    }

                    var splitAddress = jAddress.fullAddress.split(',');
                    if (splitAddress.length >= 3)
                    {
                    $scope.country=splitAddress[splitAddress.length-1];       
                    $scope.state=splitAddress[splitAddress.length-2];
                    $scope.city=splitAddress[splitAddress.length-3];
                    }
                    if (splitAddress.length >= 4)
                    {
                        $scope.suburb=splitAddress[splitAddress.length-4];;
                    }
                    if (splitAddress.length >= 5)
                    {
                        $scope.address2=splitAddress[splitAddress.length-5];;
                    }
            }
    }
    
    $scope.saveSelection = function()
    {
            var position = MapFunctions.getCenter();
//            console.log(JSON.stringify(position));
        
            onlyMarker.latitude = position.k; // Not sure why this is this way.
            onlyMarker.longitude = position.D;
            $localStorage.chosenAddress = {
                                            address1: $scope.address1,
                                            address2: $scope.address2,
                                            suburb: $scope.suburb,
                                            city: $scope.city,
                                            state: $scope.state,
                                            country: $scope.country,
                                            pinZipCode: $scope.pinZipCode
                                            };
            
            $localStorage.chosenLocation = onlyMarker;
        
            $location.path('/mobilePassword');      
        
    }
}
]);
_myApp.controller('searchResultsController', ['$scope','$http', '$routeParams', '$location' , 'GlobalVariables', 'testVariables','$localStorage', 'MapFunctions', function($scope,$http,$routeparams,$location, GlobalVariables, testVariables, $localStorage, MapFunctions) 
    {
        var searchObj = {};
        $scope.moreLocation = (GlobalVariables.addAnother);
        $scope.noResults = null;
        $scope.showHide = false;
        
        var searchBtnElement; 
        var undisabledClassName;
        
        if ($scope.showHide)
            $scope.lblShowHide = 'Hide';
        else
            $scope.lblShowHide = 'Show';
        
        $scope.goToProfilePage = function()
        {
            $location.path('/profilePage');
        }
        $scope.recentSearches = $localStorage.recentSearches;
        if ($routeparams.searchObj != undefined)
        {
            searchObj = JSON.parse($routeparams.searchObj);
        }
        
        $scope.showRecent = function()
        {
            console.log('i came here');
            setTimeout(function ()
                       {
                       $scope.$apply(function() {
                        $scope.showHide = !($scope.showHide);
                        if ($scope.showHide)
                                $scope.lblShowHide = 'Hide';
                        else
                                $scope.lblShowHide = 'Show';
                        }
                                    )}, 500);
            
            

        }
        
        function addToLocalStorage(filterObj)
        {
            var exS = $localStorage.recentSearches;
            
            if (exS == undefined|| exS == null) exS = [];
            
            var chIfExisting = exS.filter(function(e)
                                          {
                                              return (e.qry == filterObj.qry);
                                          });
            if (chIfExisting.length == 0)
            {
                if (exS.length == 5)    // Restricting 5, this logic to be revamped.
                {
                    exS.shift();
                }
                exS.push(
                        {qry:filterObj.qry,
                         when:new Date()
                        });
                $localStorage.recentSearches= exS;
            }
        }

//        $scope.results = [];
        function localSearch(filterObj)
        {
                $scope.showHideProgr = true;
                $scope.noResults = '';
                addToLocalStorage(filterObj.filterQry);
                
                $scope.results = testVariables.searchById(filterObj.filterQry);
                searchBtnElement.className = undisabledClassName;
                $scope.showHideProgr = false;
                if ($scope.results.length == 0)
                        $scope.noResults ="No results found";
                else
                        $scope.noResults = $scope.results.length + ' Results Found';
        }
        function serverCall(filterObj)
        {
            var st = new Date();
            $scope.showHideProgr = true;
            $scope.noResults = '';
            $http({
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                url : GlobalVariables.baseUrl +'/search',
                data : filterObj
                })
                .success(function(data, status, header, config)
                {
//                    console.log("Success "+JSON.stringify(data));
                    $scope.results = data.response;
                    searchBtnElement.className = undisabledClassName;
                    $scope.showHideProgr = false;
                    $scope.searchTxt = searchObj.searchTxt;
                    var endD = new Date();
                    console.log(endD - st);
                    if ($scope.results.length == 0)
                        $scope.noResults ="No results found";
                    else
                        $scope.noResults = $scope.results.length + ' Results Found';
                })
                .error(function (data,status, header,config)
                {
                console.log('Everyone will fail to see what they wanted!');
                $scope.monthsToChoose = [{"yyyymm":"201507","MON_YYYY":"Jul 2015"}];
                 });
        }
        function serverSearch(filterObj)
        {
            addToLocalStorage(filterObj.filterQry);    
            var position = $localStorage.startupLocation; 
//            console.log('Position Local Storage'+ JSON.stringify(position));
            var address = $localStorage.startupAddress;
            var regAdds = $localStorage.registerAdds[0];    // Assumed to have only one registration per device
            var splitAddress = address.split(',');
            filterObj.filterQry.splitAddress = splitAddress;
            filterObj.filterQry.uuid = $localStorage.deviceInfo.uuid;
            filterObj.filterQry.platform = $localStorage.deviceInfo.platform;
            filterObj.filterQry.locId = regAdds.locId;
            filterObj.filterQry.latitude = position.coords.latitude;
            filterObj.filterQry.longitude = position.coords.longitude;
            serverCall(filterObj);
        }
        $scope.addAnotherLocation = function()
        {
            
            var pObject =   {
                                anotherRegistraion:$scope.moreLocation
                            };
            console.log('Going to fire :'+ JSON.stringify(pObject));
            
            $location.path('/landing/'+JSON.stringify(pObject));
        }
        $scope.setSelectedItem = function(sResult)
        {
            console.log('sResult'+sResult);
            $scope.sResult = sResult;
        }
        $scope.openMap = function(sResult)
        {
            var pObject = {
                    latitude: sResult.latitude,
                    longitude: sResult.longitude
            }
            $location.path('/searchMap/'+JSON.stringify(pObject));
        }
        $scope.search = function()
        {
            var searchObj = {};
            searchObj.searchTxt = $scope.searchTxt;
            
            var filterObj = {};
            var filterQry = {qry:searchObj.searchTxt};
            filterObj.filterQry = filterQry;
            
            var searchDivElement = document.getElementById('searchDiv'); 
            searchDivElement.className = '';
            searchBtnElement = document.getElementById('searchBtn');
            undisabledClassName = searchBtnElement.className;
            searchBtnElement.className = undisabledClassName + ' disabled';
            if (GlobalVariables.prodMode)
                serverSearch(filterObj);
            else
                localSearch(filterObj);

        
        }
    }
]);
