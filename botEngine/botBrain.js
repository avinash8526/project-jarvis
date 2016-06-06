/**
 * Created by avagrawal on 6/2/16.
 */

var fbUtils = require('../utils/fbUtils');
var cms =  require('../utils/cms');
var debug = require('debug')('project-jarvis:botBrainJS');

var botBrain = {};
var cruiseApi = require('../utils/cruiseApi');

botBrain.possibleEntityValues = [
    'cruise',
    'greet',
    'location',
    'help',
    'mail_me',
    'greet',
    'email',
    'hotel'
    // add more enttities
];
botBrain.firstEntityValue = function(entities, entity){
    const val = entities && entities[entity] &&
            Array.isArray(entities[entity]) &&
            entities[entity].length > 0 &&
            entities[entity][0].value
        ;
    if (!val) {
        return null;
    }
    return typeof val === 'object' ? val.value : val;
};

botBrain.actions = {
    say : function(sessionId, context, message, cb) {
        var recipientId = fbUtils.sessions[sessionId].fbid;
        if (recipientId) {
            fbUtils.fbMessage(recipientId, message, function(err, data){
                if (err) {
                    console.log(
                        'Oops! An error occurred while forwarding the response to',
                        recipientId,
                        ':',
                        err
                    );
                }

                // Let's give the wheel back to our bot
                cb();
            });
        } else {
            console.log('Oops! Couldn\'t find user for session:', sessionId);
            // Giving the wheel back to our bot
            cb();
        }
    },
    merge : function(sessionId, context, entities, message, cb) {
        var currentContext = {};
        if(botBrain.possibleEntityValues != undefined && botBrain.possibleEntityValues.length > 0){
            for(val in botBrain.possibleEntityValues) {
                var value = botBrain.possibleEntityValues[val]
                currentContext[value]= botBrain.firstEntityValue(entities,value);
            }
        }
        for(key in currentContext){
            if(currentContext[key] != undefined){
                context[key] = currentContext[key];
            }
        }
        debug(context);
        cb(context);
    },

    error: function(sessionId, context, error) {
        console.log(error.message);
    },

    getCruiseInformation : function(sessionId,context,cb){
        //call cruise api
        // take the response object from cruise api
        var callback = function(responseObj) {
            try {
                responseObj.destination = "Bahamas";
                responseObj.destinationCode = "BH";
                cms.sendCruiseSearchResult(cms.send, sessionId, responseObj);
            }
            catch(error) {
                debug(error);
                cb();
            }

            cb();
        };

        cruiseApi.makeApiCall(context, callback);

    },

    getHotelInformation : function(sessionId,context,cb){
        // call hotel api
        cb();
    },

    sendMail : function(sessionId,context,cb) {

        cb();
    },

    cleanContext : function(sessionId,context,cb) {

        cb();
    },


};

module.exports = botBrain;

