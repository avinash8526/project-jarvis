var cruiseApi = {};

var debug = require('debug')('project-jarvis:server');
var http = require('http');
var request = require('request');
var fs = require('fs');
var config = require('../config/config');


cruiseApi.getFilters = function() {

    var processData = function (data) {
        data = JSON.parse(data);
        var processedData = {};

        processedData.cruiseLines = {};
        var cruiseLines = data.searchFilters.cruiseLines;
        cruiseLines.forEach(function(cruiseLine) {
            processedData.cruiseLines[cruiseLine.name] = cruiseLine.code;
        });

        processedData.destinations = {};
        var destinations = data.searchFilters.destinations;
        destinations.forEach(function(destination) {
            processedData.destinations[destination.destination.toLowerCase()] = destination.code;
        });


        processedData.departureLocations = {};
        var departureLocations = data.searchFilters.departureLocations;
        departureLocations.forEach(function(departureLocation) {
            processedData.departureLocations[departureLocation.name] = departureLocation.code;
        });

        processedData.lengths = {};
        var lengths = data.searchFilters.lengths;
        lengths.forEach(function(length) {
            processedData.lengths[length] = length;
        });


        return processedData;
    };


    request(config.apiCalls.filterUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            jarvisFilters = processData(body);
        } else {
            debug("Some error has occurred in making call to " + config.apiCalls.filterUrl + "  -- " + error)
        }
    });


};

cruiseApi.getRandomCode = function (type, callback) {
    var getRandomCodeFromData = function (data) {
        switch (type) {
            case "destination":
                var randomCruise = {};
                var count = 0;
                for(key in jarvisFilters.destinations){
                   if(count < 3){
                       var obj_keys = Object.keys(jarvisFilters.destinations);
                       var ran_key = obj_keys[Math.floor(Math.random() * obj_keys.length)];
                       randomCruise[ran_key] = jarvisFilters.destinations[ran_key] ;
                       count ++;
                   }
                }
                break;
        }
        return randomCruise;
    };
    callback.call(null, getRandomCodeFromData(jarvisFilters));
};

cruiseApi.getCode = function (name, type) {

    var getCodeFromData = function (data) {
        var code = null;

        switch (type) {
            case "cruiseLine":
                Object.keys(data.cruiseLines).forEach(function (cruiseLineName) {
                   if(cruiseLineName.indexOf(name) >= 0) {
                        code = data.cruiseLines[cruiseLineName];
                        return
                   }
                });
            break;


            case "departure":
                Object.keys(data.departureLocations).forEach(function (departureLocationName) {
                    if(departureLocationName.indexOf(name) >= 0) {
                        code = data.departureLocations[departureLocationName];
                        return
                    }
                });
            break;


            case "destination":
                Object.keys(data.destinations).forEach(function (destinationName) {
                    if(destinationName.indexOf(name) >= 0) {
                        code = data.destinations[destinationName];
                        return
                    }
                });
            break;
        }
        return code;

    };

    return getCodeFromData(jarvisFilters);
};


cruiseApi.getNameFromCode = function (code, type) {

    var getName = function (data) {
        var name = null;

        switch (type) {
            case "cruiseLine":
                var cruiseLines = data.cruiseLines;
                Object.keys(cruiseLines).forEach(function (cruiseLineName) {
                   if(cruiseLines[cruiseLineName] === code) {
                        name = cruiseLineName;
                        return
                   }
                });
            break;


            case "departure":
                var departureLocations = data.departureLocations;
                Object.keys(departureLocations).forEach(function (departureLocationName) {
                   if(departureLocations[departureLocationName] === code) {
                        name = departureLocationName;
                        return
                   }
                });
            break;


            case "destination":
                var destinations = data.destinations;
                Object.keys(destinations).forEach(function (destinationName) {
                   if(destinations[destinationName] === code) {
                        name = destinationName;
                        return
                   }
                });
            break;
        }
        return name;

    };

    return getName(jarvisFilters);
};

var prepareUrl = function (context) {
    var url = config.apiCalls.apiUrl + "?";
    config.apiCalls.apiParameters.forEach(function (parameter) {
        if(context[parameter]) {
            url += parameter + "=" + context[parameter] + "&";
        }
    });
    return url;
};

var processData = function (data) {
    var result = {};
    var processedData = [];
    var sailings = data.sailings;

    if(sailings && sailings.length > 5)
        sailings = sailings.slice(0, 5);
    sailings.forEach(function (sailing) {
        var obj = {};

        obj.cruiseLineName = sailing.cruiseLine.name;
        obj.shipName = sailing.ship.name;
        obj.price = sailing.leadInPrice;
        obj.imageUrl = sailing.ship.photoUrl;
        obj.webUrl = config.apiCalls.targetUrl + "?destination=" +
            config.apiCalls.targetUrlParametersMapping.destination[sailing.itinerary.destination.destination] +
            "&selected-option=cruise-line&cruise-line=" +
            config.apiCalls.targetUrlParametersMapping.cruiseLine[sailing.cruiseLine.name];

        processedData.push(obj);
    });

    result.processedData = processedData;
    return result;
};

var buildCruiseContext = function (context) {
    var cruiseContext = {};
    if(context[1] != undefined){
        cruiseContext[config.apiCalls.apiParameters[0]] = jarvisFilters.destinations[context[1].toLowerCase()];
    }
    else{
        if(context.location != undefined){
            cruiseContext[config.apiCalls.apiParameters[0]] = jarvisFilters.destinations[context.location.toLowerCase()];
        }
    }
    //cruiseContext.sortBy
    if(context[2] != undefined) {
        cruiseContext[config.apiCalls.apiParameters[1]] = context[2];
    }
    cruiseContext[config.apiCalls.apiParameters[2]] = "asc";
    cruiseContext[config.apiCalls.apiParameters[3]] = 5;
    cruiseContext[config.apiCalls.apiParameters[4]] = 0;
    cruiseContext[config.apiCalls.apiParameters[7]] = "SbCXH6HbBpGB3WzvOzpLYE54otkpFzoN";

    return cruiseContext;
};

cruiseApi.makeApiCall = function (context, buildMessage) {
    var url = prepareUrl(buildCruiseContext(context));

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = processData(JSON.parse(body));
            result.destination = context.location ? context.location : context[1];
            buildMessage.call(null, result );
        } else {
            debug("Some error has occurred in making call to " + url + "  -- " + error)
        }
    });
};

module.exports = cruiseApi;
