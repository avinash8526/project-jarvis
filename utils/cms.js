/**
 * Created by avagrawal on 6/4/16.
 */


var cms = {};
var buttonModel = require('../models/fbMessage/buttonModel');
var elementModel = require('../models/fbMessage/elementModel');
var messageTemplate = require('../models/fbMessage/messageTemplateModel');
var fbUtils = require('./fbUtils');

cms.buildButtonMessage = function(type,callback,sessionId,responseObj) {
        if(type == 'mock'){
            var bM = new buttonModel.buttonModel();
            bM.buildUrlButton("web_url","http://google.com","Google");
            bM.buildUrlButton("web_url","http://yahoo.com","Yahoo");
            var mT = new messageTemplate.messageTemplateModel();
            callback(mT.buildButtonMessage("Search Cruice here",bM.getButtonsList()),sessionId);
        }
    else {
            // todo:
        }
    };

cms.buildGeneicMessage = function(type,callback,sessionId,responseObj){
    if(type == 'mock'){
        var bM = new buttonModel.buttonModel();
        bM.buildUrlButton("web_url","http://google.com","Google");
        bM.buildUrlButton("web_url","http://yahoo.com","Yahoo");
        bM.buildPayLoadButton("postback","Ask Jarvis More","PAYLOAD");

        var eM = new elementModel.elementModel();
        eM.addElements(bM,"Cruise One","Subtitle Cruise","http://dreamatico.com/data_images/cruise/cruise-6.jpg");
        eM.addElements(bM,"Cruise Two","Subtitle Cruise two","http://i2.cdn.turner.com/cnnnext/dam/assets/160108142736-regents-seven-seas-explorer-super-169.jpg");
        var mT = new messageTemplate.messageTemplateModel();
        callback(mT.buildGenericMessage(eM.getElementModel()),sessionId);
    }
    else {
        // todo:
    }
};

cms.sendCruiseSearchResult = function(callback, sessionId, responseObj) {
    var expediaImgUrl = "https://www.expedia.com/_dms/header/logo.svg?locale=en_US&siteid=1";
    var eM = new elementModel.elementModel();

    // Adding cruise results
    responseObj.cruises.forEach(function (cruiseDetail) {
        var bM = new buttonModel.buttonModel();
        bM.buildUrlButton("web_url", cruiseDetail.webUrl, "Book Now");
        eM.addElements(bM, cruiseDetail.cruiseLineName, cruiseDetail.shipName, cruiseDetail.imageUrl);
    });

    // Adding Sort and Mail button
    var additionalButtons = new buttonModel.buttonModel();
    additionalButtons.buildPayLoadButton("postback", "SORT", "SORT_" + responseObj.destinationCode);
    additionalButtons.buildPayLoadButton("postback", "MAIL", "MAIL_" + responseObj.destination);
    eM.addElements(additionalButtons, "Additional", "Additional", expediaImgUrl);
    var messageTemplate1 = new messageTemplate.messageTemplateModel();
    var templateBody = messageTemplate1.buildGenericMessage(eM.getElementModel());
    callback(templateBody, sessionId);
}

cms.send = function(message,sessionId){
        var strMessage = JSON.stringify(message);
        var recipientId = fbUtils.sessions[sessionId].fbid;
        if (recipientId) {
            fbUtils.fbTemplateMessage(recipientId, strMessage, function(err, data){
                if (err) {
                    console.log(
                        'Oops! An error occurred while forwarding the response to',
                        recipientId,
                        ':',
                        err
                    );
                }
            });
        } else {
            console.log('Oops! Couldn\'t find user for session:', sessionId);
            // Giving the wheel back to our bot
        }
    };

module.exports = cms;


