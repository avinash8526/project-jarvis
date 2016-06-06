/**
 * Created by avagrawal on 6/6/16.
 */

var ourBrain = {};

ourBrain.getCruiseInformation = function(sessionID,data,callback){

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
