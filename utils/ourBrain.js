/**
 * Created by avagrawal on 6/6/16.
 */

var ourBrain = {};
var cruiseApi = require('../utils/cruiseApi');
var cms =  require('../utils/cms');

ourBrain.getCruiseInformation = function(sessionId,data){
    var callback = function(data) {
        try {
            cms.buildGeneicMessage('mock',cms.send,sessionId,data);
            cms.buildButtonMessage('mock',cms.send,sessionId,data);
        }
        catch(error) {
            debug(error);
        }
    };

    cruiseApi.makeApiCall(data, callback);

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