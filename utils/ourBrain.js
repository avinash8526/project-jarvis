
var ourBrain = {};
var cruiseApi = require('../utils/cruiseApi');
var cms =  require('../utils/cms');

ourBrain.getCruiseInformation = function(sessionId,context){

    var buildLocationFoundMessage = function(responseObj) {
        try {
            cms.buildButtonMessage('locationFound', cms.send, sessionId, responseObj);
        }
        catch (error) {
            debug(error);
        }
    };

    cruiseApi.makeApiCall(context, buildLocationFoundMessage);

    if (callback && typeof(callback) === "function") {
        callback();
    }

};

ourBrain.getHotelInformation = function(sessionID,data,callback) {
    if (callback && typeof(callback) === "function") {
        callback();
    }
};


module.exports = ourBrain;
