
var fbUtils = require('../utils/fbUtils');
var cms =  require('../utils/cms');
var debug = require('debug')('project-jarvis:botBrainJS');

var botBrain = {};
var cruiseApi = require('../utils/cruiseApi');
var fbPostApi = require('../utils/fbPostApi');
var mailer = require('../utils/mailer');
var config = require('../config/config');

botBrain.possibleEntityValues = [
    'cruise',
    'greet',
    'location',
    'help',
    'mail_me',
    'email',
    'hotel'
    // add more entities
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
        sendMessageToFb(sessionId,message);
        cb();
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
        var buildLocationNotFoundMessage = function(responseObj) {
            try {
                    cms.buildButtonMessage('cruiseCodeNotFound', cms.send, sessionId, responseObj);
                    cb();
                }
            catch (error) {
                debug(error);
                cb();
            }

        };

        var buildLocationFoundMessage = function(responseObj) {
            try {
                cms.buildButtonMessage('locationFound', cms.send, sessionId, responseObj);
                cb();
            }
            catch (error) {
                debug(error);
                cb();
            }
        };

        var destCode = cruiseApi.getCode(context.location.toLowerCase(), "destination");
        if (destCode) {
            //context.destinations = destCode;
            cruiseApi.makeApiCall(context, buildLocationFoundMessage);
            var webUrl = "https://www.expedia.com/Cruise-Search?destination=" + context.location ;
            try {
                fbPostApi.makeApiCall("Recent Search : Cruise to " + context.location + "! \n" + webUrl);
            }
            catch(error){
                console.log("FB api call failed");
            }


        }
        else {
            sendMessageToFb(sessionId,"It seems we don't have cruises in location "+context.location);
            cruiseApi.getRandomCode("destination", buildLocationNotFoundMessage);

        }
    },

    getHotelInformation : function(sessionId,context,cb){
        // call hotel api
        cb();
    },

    sendMail : function(sessionId,context,cb) {
        var destinatCode  = jarvisFilters.destinations[context.location.toLowerCase()];
        var email  = context.email;
        if(destinatCode && email){
            mailer.mailDetails(destinatCode, email, cb);
        }
        else {
            sendMessageToFb(sessionId,"Something went wrong");
            cb();
        }
        
    },

    cleanContext : function(sessionId,context,cb) {

        cb();
    }


};

function sendMessageToFb(sessionId,message) {
    var recipientId = fbUtils.sessions[sessionId].fbid;
    if (recipientId) {
        fbUtils.fbMessage(recipientId, message, function (err, data) {
            if (err) {
                console.log(
                    'Oops! An error occurred while forwarding the response to',
                    recipientId,
                    ':',
                    err
                );
            }
        });
    }
    else {
        console.log('Oops! Couldn\'t find user for session:', sessionId);
        // Giving the wheel back to our bot
    }
}

module.exports = botBrain;

