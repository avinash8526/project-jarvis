/**
 * Created by avagrawal on 6/2/16.
 */

var fbUtils = require('../utils/fbUtils');
var botBrain = {};

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
        // create context here
        cb(context);
    },
    error: function(sessionId, context, error) {
        console.log(error.message);
    },
};

module.exports = botBrain;

