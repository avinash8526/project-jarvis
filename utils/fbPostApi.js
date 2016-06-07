var fbPostApi = {};

var debug = require('debug')('project-jarvis:server');
var http = require('http');
var request = require('request');
var config = require('../config/config');
var querystring = require('querystring');

fbPostApi.makeApiCall = function (messageToPost) {
    var post_data = querystring.stringify({
        'message' : messageToPost ,
        'access_token' : config.FB_PAGE_TOKEN
    });

    request.post({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     config.apiCalls.facebookPostUrl,
        body:    post_data
    }, function(error, response, body){
        debug(body);
    });
};

module.exports = fbPostApi;
