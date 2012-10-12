var geoOnce = false;
var geoService = null;
function geoFind(successcb, errorcb) {
    webinos.discovery.findServices(
        new ServiceType('http://www.w3.org/ns/api-perms/geolocation'), 
        { onFound: function(service) {
            geoOnFound(service, successcb, errorcb);
        } }
    );
}
function geoOnFound(service, successcb, errorcb) {
   console.log("found: " + service.serviceAddress);
   if (!geoOnce) {
        geoOnce = true;
        geoBind(service, successcb, errorcb);
   } else {
        console.log("Not bound : " + service.serviceAddress);                   
   }
}
function geoBind(service, successcb, errorcb) {
    service.bindService({onBind: function (boundService) {
            console.log("Bound service: " + boundService.serviceAddress);
            successcb(boundService);
        }
    }); 
}
function geoGetCurrentPositionFromService(service, successcb, errorcb) {
    service.getCurrentPosition(successcb, errorcb, {});
}

function geoGetCurrentPosition(successcb, errorcb) {
    if (geoService === null) {
        geoFind(function(svc) {
            geoService = svc;
            geoGetCurrentPosition(successcb, errorcb);
        }, function(err) {
            console.log("Error finding or binding to location service: " + err);
            errorcb(err);            
        });
    
    } else {
        geoGetCurrentPositionFromService(geoService, function(position) {
            successcb(position);
        }, function(err) {
            console.log("Error calling location service: " + err);
            errorcb(err);
        });        
    }
}


function loadGoogleMapsScript(callbackname) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?&sensor=false&callback=" + callbackname;
  document.body.appendChild(script);
}

