
var cms = {};
var buttonModel = require('../models/fbMessage/buttonModel');
var elementModel = require('../models/fbMessage/elementModel');
var messageTemplate = require('../models/fbMessage/messageTemplateModel');
var fbUtils = require('./fbUtils');

cms.buildButtonMessage = function(type,callback,sessionId,responseObj) {
        var bM;
        var eM;
        if(type == 'mock'){
            bM = new buttonModel.buttonModel();
            bM.buildUrlButton("web_url","http://google.com","Google");
            bM.buildUrlButton("web_url","http://yahoo.com","Yahoo");
            var mT = new messageTemplate.messageTemplateModel();
            callback(mT.buildButtonMessage("Search Cruise here",bM.getButtonsList()),sessionId);
        }
        else if(type=='locationFound') {
            var expediaImgUrl = "https://www.expedia.com/_dms/header/logo.svg?locale=en_US&siteid=1";
            eM = new elementModel.elementModel();
            responseObj.forEach(function(cruiseObj){
                bM = new buttonModel.buttonModel();
                bM.buildUrlButton("web_url", cruiseObj.webUrl,"Book Now");
                // to add more buttona
                eM.addElements(bM,cruiseObj.cruiseLineName + " @ $" + cruiseObj.price, cruiseObj.shipName, cruiseObj.imageUrl);
            });
            var additionalButtons = new buttonModel.buttonModel();
            additionalButtons.buildPayLoadButton("postback", "Sort", "SORT_" + responseObj.destinationCode);
            additionalButtons.buildPayLoadButton("postback", "Mail", "MAIL_" + responseObj.destination);
            eM.addElements(additionalButtons,"Your Choices", "Choose what you want to do next", expediaImgUrl);

            mT = new messageTemplate.messageTemplateModel();
            callback(mT.buildGenericMessage(eM.getElementModel()),sessionId);
        }
        else if(type=='cruiseCodeNotFound') {
            eM = new elementModel.elementModel();
            bM = new buttonModel.buttonModel();
            for (key in responseObj) {
                bM.buildPayLoadButton("postback",key, "LOCATION_"+ key);
            }
            mT = new messageTemplate.messageTemplateModel();
            callback(mT.buildButtonMessage("Select any of the location below",bM.getButtonsList()),sessionId);
        }
    };

cms.buildGenericMessage = function(type, callback, sessionId, responseObj){
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
};

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


