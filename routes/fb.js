/**
 * Created by avagrawal on 6/1/16.
 */

var config = require('../config/config');
var express = require('express');
var router = express.Router();
var fbUtils = require('../utils/fbUtils');
var botBrain = require('../botEngine/botBrain');
var Wit = require('../botEngine/wit').Wit;
var ourBrain = require('../utils/ourBrain');
var debug = require('debug')('project-jarvis:fbJS');
var wit = new Wit(config.WIT_TOKEN, botBrain.actions);

router.get('/', function (req, res, next) {
    if (!config.FB_VERIFY_TOKEN) {
        throw new Error('missing FB_VERIFY_TOKEN');
    }
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
});


router.post('/', function (req, res, next) {
    var messaging = fbUtils.getFirstMessagingEntry(req.body);
    if (messaging && messaging.recipient.id === config.FB_PAGE_ID) {
        var sender = messaging.sender.id;
        var sessionId = fbUtils.findOrCreateSession(sender);

        if(messaging.message){
            var msg = messaging.message.text;
            var atts = messaging.message.attachments;
            if (atts) {
                fbUtils.fbMessage(
                    sender,
                    'Sorry I can only process text messages for now.'
                );
            }
            else if (msg) {
                callWit(sessionId,msg);
            }
        }
        if(messaging.postback){
            //sort_destination_[price, asc/desc]
            //sort_By, sortOrder ={asc/desc}
            //sort_destination_price
            //sort_destination_asc/desc

            var payloadContext = String(messaging.postback.payload).split("_");
            switch(payloadContext[0]) {
                case 'SORT':
                    //var destination = payloadContext[1];
                    //var sortType = payloadContext[2];
                    var cruiseContext = {};
                    cruiseContext.location = payloadContext[1];
                    cruiseContext.sortBy = payloadContext[2];
                    ourBrain.getCruiseInformation(sessionId, cruiseContext);
                    break;
                case 'MAIL':
                    var recipientId = fbUtils.sessions[sessionId].fbid;
                    if(payloadContext[1] != undefined){
                        if(jarvisFilters.destinations[payloadContext[1].toLowerCase()] != undefined){
                            fbUtils.sessions[sessionId].context.location = payloadContext[1];
                            fbUtils.sessions[sessionId].context.mail_me = "Mail";
                            callWit(sessionId,msg);
                        }
                        else {
                            fbUtils.fbMessage(
                                recipientId,
                                'There is no cruise from this destination, kindly search for other options, type help'
                            );
                        }
                    }
                    else {
                        fbUtils.fbMessage(
                            recipientId,
                            'Context information is lost , please start again, we deeply regret for this'
                        );
                    }
                    // CODE AVINASH
                    break;
                case 'LOCATION':
                    //code neha
                    break;
                default:
                    debug("Not a valid option");

            }


        }
    }
    res.sendStatus(200);
});

function callWit(sessionId,msg){
    wit.runActions(
        sessionId, // the user's current session
        msg, // the user's message
        fbUtils.sessions[sessionId].context, // the user's current session state
        function (error, context) {
            if (error) {
                console.log('Oops! Got an error from Wit:', error);
            } else {
                console.log('Waiting for futher messages.');

                // Based on the session state, you might want to reset the session.
                // This depends heavily on the business logic of your bot.
                // Example:
                // if (context['done']) {
                //   delete sessions[sessionId];
                // }

                // Updating the user's current session state
                fbUtils.sessions[sessionId].context = context;
            }
        }
    );
}


module.exports = router;
