var cruiseApi = {};

var debug = require('debug')('project-jarvis:server');
var http = require('http');
var request = require('request');
var fs = require('fs');
var config = require('../config/config')


cruiseApi.getFilters = function() {
    
    var writeToFile = function (data) {
        debug(data)
        fs.writeFile(config.apiCalls.filtersJsonFile, data, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    };
    
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


        return JSON.stringify(processedData);
    };


    request(config.apiCalls.filterUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var processedData = processData(body);
            writeToFile(processedData); // Show the HTML for the Google homepage.
        } else {
            debug("Some error has occurred in making call to " + config.apiCalls.filterUrl + "  -- " + error)
        }
    });


}

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

    fs.readFile(config.apiCalls.filtersJsonFile, function (err, data) {
        if (err) {
            return console.error(err);
        }
        data = JSON.parse(data);
        return getCodeFromData(data);
    });
}

cruiseApi.makeApiCall = function (context, callback) {
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

    var url = prepareUrl(context);

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback.call(null, processData(JSON.parse(body)));
        } else {
            debug("Some error has occurred in making call to " + url + "  -- " + error)
        }
    });


}

module.exports = cruiseApi;