/**
 * Created by avagrawal on 6/6/16.
 */

var ourBrain = {};
var cruiseApi = require('../utils/cruiseApi');
var cms =  require('../utils/cms');

ourBrain.getCruiseInformation = function(sessionId,context){
    var callback = function(responseObj) {
        try {
            //cms.buildGeneicMessage('mock', cms.send, sessionId, responseObj);
            //cms.buildButtonMessage('mock', cms.send, sessionId, responseObj);
            cms.buildButtonMessage('cruiseCodeNotFound', cms.send, sessionId, responseObj);
        }
        catch (error) {
            debug(error);
        }
    };
    if (context.location == cruiseApi.getCode(context.location, "destination")) {
        cms.buildButtonMessage('locationFound', cms.send, sessionId, responseObj);
    }
    else {
        cruiseApi.makeApiCall(context, callback);
    }

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
