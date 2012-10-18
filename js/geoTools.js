/* This file uses globals.  Read the globals.js to check which ones */

var geoTools = {};
geoTools.geoOnce = false;
geoTools.geoService = null;
geoTools.googleMapLoaded = false;


geoTools.geoFind = function(successcb, errorcb) {
    webinos.discovery.findServices(
        new ServiceType('http://www.w3.org/ns/api-perms/geolocation'), 
        { onFound: function(service) {
            geoTools.geoOnFound(service, successcb, errorcb);
        } }
    );
}
geoTools.geoOnFound = function(service, successcb, errorcb) {
   console.log("found: " + service.serviceAddress);
   if (!geoTools.geoOnce) {
        geoTools.geoOnce = true;
        geoTools.geoBind(service, successcb, errorcb);
   } else {
        console.log("Not bound : " + service.serviceAddress);                   
   }
}
geoTools.geoBind = function(service, successcb, errorcb) {
    service.bindService({onBind: function (boundService) {
            console.log("Bound service: " + boundService.serviceAddress);
            successcb(boundService);
        }
    }); 
}
geoTools.geoGetCurrentPositionFromService = function(service, successcb, errorcb) {
    service.getCurrentPosition(successcb, errorcb, {});
}

geoTools.geoGetCurrentPosition = function(successcb, errorcb) {
    if (geoTools.geoService === null) {
        geoTools.geoFind(function(svc) {
            geoTools.geoService = svc;
            geoTools.geoGetCurrentPosition(successcb, errorcb);
        }, function(err) {
            console.log("Error finding or binding to location service: " + err);
            errorcb(err);            
        });
    
    } else {
        geoTools.geoGetCurrentPositionFromService(geoTools.geoService, function(position) {
            successcb(position);
        }, function(err) {
            console.log("Error calling location service: " + err);
            errorcb(err);
        });        
    }
}


geoTools.loadGoogleMapsScript = function(callbackname) {
  if (!geoTools.googleMapLoaded) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://maps.googleapis.com/maps/api/js?&sensor=false&callback=" + callbackname;
      document.body.appendChild(script);
      geoTools.googleMapLoaded = true;
  }
}

