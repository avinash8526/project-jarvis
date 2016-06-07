
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
        config.sender = sender;
        var sessionId = fbUtils.findOrCreateSession(sender);

        if(messaging.message){
            var recipientId = fbUtils.sessions[sessionId].fbid;
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
            var recipientId = fbUtils.sessions[sessionId].fbid;
            var payloadContext = String(messaging.postback.payload).split("_");
            //fbUtils.fbMessage(
            //    recipientId,
            //    'Processing...'
            //);

            if(payloadContext[1] != undefined && jarvisFilters.destinations[payloadContext[1].toLowerCase()] != undefined) {
                switch (payloadContext[0]) {
                    case 'SORT':
                        //sort_destination_[price, asc/desc]
                        //sort_By, sortOrder ={asc/desc}
                        //sort_destination_price
                        //sort_destination_asc/desc
                        //payloadContext[1] = jarvisFilters.destinations[payloadContext[1].toLowerCase()];
                        ourBrain.getCruiseInformation(sessionId, payloadContext);
                        break;

                    case 'MAIL':
                        fbUtils.sessions[sessionId].context.location = payloadContext[1];
                        fbUtils.sessions[sessionId].context.mail_me = "Mail";
                        try {
                            callWit(sessionId, msg);
                        }
                        catch(error) {
                            console.log("Mailing server is down");
                            fbUtils.fbMessage(
                                recipientId,
                                'Mailing server is down'
                            );
                        }


                        break;

                    case 'LOCATION':
                        //payloadContext[1] = jarvisFilters.destinations[payloadContext[1].toLowerCase()];
                        ourBrain.getCruiseInformation(sessionId, payloadContext);
                        break;


                    default:
                        debug("Not a valid option");
                }
            }
            else if(payloadContext[0] == 'JARVIS'){
                fbUtils.fbMessage(
                    recipientId,
                    'Happy to help more on this. Type help to view more choices.'
                );

            }
            else {
                fbUtils.fbMessage(
                    recipientId,
                    'There is no cruise from this destination, kindly search for other options, type help'
                );
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
                fbUtils.sessions[sessionId].context = context;
            }
        }
    );
}


module.exports = router;
