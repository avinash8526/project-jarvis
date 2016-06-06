/**
 * Created by avagrawal on 6/1/16.
 */

var fbUtils = {};
var config = require('../config/config');
var request = require('request');


fbUtils.fbReq = request.defaults({
    uri: 'https://graph.facebook.com/me/messages',
    method: 'POST',
    json: true,
    qs: { access_token: config.FB_PAGE_TOKEN },
    headers: {'Content-Type': 'application/json'},
});

fbUtils.fbMessage = function(recipientId, msg, cb){
    var opts = {
        form: {
            recipient: {
                id: recipientId,
            },
            message: {
                text: msg
            },

        },
    };
    fbUtils.fbReq(opts, function(err, resp, data){
        if (cb) {
            cb(err || data.error && data.error.message, data);
        }
    });
};

fbUtils.fbTemplateMessage = function(recipientId, msg, cb){
    var opts = {
        form: {
            recipient: {
                id: recipientId,
            },
            message: msg,

        },
    };
    fbUtils.fbReq(opts, function(err, resp, data){
        if (cb) {
            cb(err || data.error && data.error.message, data);
        }
    });
};


fbUtils.getFirstMessagingEntry = function(body){
    const val = body.object == 'page' &&
            body.entry &&
            Array.isArray(body.entry) &&
            body.entry.length > 0 &&
            body.entry[0] &&
            body.entry[0].id === config.FB_PAGE_ID &&
            body.entry[0].messaging &&
            Array.isArray(body.entry[0].messaging) &&
            body.entry[0].messaging.length > 0 &&
            body.entry[0].messaging[0]
        ;
    return val || null;
};


fbUtils.sessions = {};

fbUtils.findOrCreateSession = function(fbid){
    var sessionId;
    for (var key in fbUtils.sessions) {
        if (fbUtils.sessions[key].fbid === fbid) {
            sessionId = key;
        }
    }
    if (!sessionId) {
        // No session found for user fbid, let's create a new one
        sessionId = new Date().toISOString();
        fbUtils.sessions[sessionId] = {fbid: fbid, context: {}};
    }
    return sessionId;
};

module.exports = fbUtils;