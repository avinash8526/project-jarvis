/**
 * Created by avagrawal on 6/1/16.
 */

var config = require('../config/config');
var express = require('express');
var router = express.Router();
var fbUtils = require('../utils/fbUtils');
var botBrain = require('../botEngine/botBrain');
var Wit = require('../botEngine/wit').Wit;

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
    if (messaging && messaging.message && messaging.recipient.id === config.FB_PAGE_ID) {
        var sender = messaging.sender.id;
        var sessionId = fbUtils.findOrCreateSession(sender);
        var msg = messaging.message.text;
        var atts = messaging.message.attachments;
        if (atts) {
            fbUtils.fbMessage(
                sender,
                'Sorry I can only process text messages for now.'
            );
        }
        else if (msg) {
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
    }
    res.sendStatus(200);
});

module.exports = router;
