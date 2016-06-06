var cruiseApi = {};

var debug = require('debug')('project-jarvis:server');
var http = require('http');
var request = require('request');
var fs = require('fs');
var config = require('../config/config')


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
            processedData.destinations[destination.destination] = destination.code;
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
            var processedData = processData(body);
            jarvisFilters = processedData;
        } else {
            debug("Some error has occurred in making call to " + config.apiCalls.filterUrl + "  -- " + error)
        }
    });


}

cruiseApi.getRandomCode = function (type, callback) {
    var getRandomCodeFromData = function () {
        switch (type) {
            case "destination":
                return jarvisFilters.destinations.slice(0,4);
                break;

        }

    };
    callback.call(null, getRandomCodeFromData(jarvisFilters));
};

cruiseApi.getCode = function (name, type) {

    var getCodeFromData = function (data) {
        var code = null;
        var list = [];

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
                    list.push(destinationName);
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
    var processedData = [];
    var sailings = data.sailings;

    if(sailings && sailings.length > 5)
        sailings = sailings.slice(0, 5);

    sailings.forEach(function (sailing) {
        var obj = {};

        obj.title = sailing.cruiseLine.name;
        obj.subTitle = sailing.ship.name;
        obj.imageUrl = sailing.ship.photoUrl;
        obj.webUrl = config.apiCalls.targetUrl + "?destination=" +
            config.apiCalls.targetUrlParametersMapping.destination[sailing.itinerary.destination.destination] +
            "&selected-option=cruise-line&cruise-line=" +
            config.apiCalls.targetUrlParametersMapping.cruiseLine[sailing.cruiseLine.name];

        processedData.push(obj);
    });

    return processedData;
};

cruiseApi.makeApiCall = function (context, callback) {

    var url = prepareUrl(context);

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback.call(null, processData(JSON.parse(body)));
        } else {
            debug("Some error has occurred in making call to " + url + "  -- " + error)
        }
    });
};

module.exports = cruiseApi;