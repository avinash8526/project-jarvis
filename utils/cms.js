/**
 * Created by avagrawal on 6/4/16.
 */


var cms = {};
var buttonModel = require('../models/fbMessage/buttonModel');
var elementModel = require('../models/fbMessage/elementModel');
var messageTemplate = require('../models/fbMessage/messageTemplateModel');
var fbUtils = require('./fbUtils');

cms.buildButtonMessage = function(type,callback,sessionId,responseObj) {
        var bM;
        if(type == 'mock'){
            bM = new buttonModel.buttonModel();
            bM.buildUrlButton("web_url","http://google.com","Google");
            bM.buildUrlButton("web_url","http://yahoo.com","Yahoo");
            var mT = new messageTemplate.messageTemplateModel();
            callback(mT.buildButtonMessage("Search Cruise here",bM.getButtonsList()),sessionId);
        }
        else if(type=='locationFound') {
            var eM = new elementModel.elementModel();
            bM = new buttonModel.buttonModel();
            responseObj.forEach(function(cruiseObj){
                bM.buildUrlButton("web_url", cruiseObj.webUrl,"Book Now");
                // to add more buttona
              //  eM.addElements(bM.getButtonsList(),cruiseObj.cruiseLineName,cruiseObj.subTitle,cruiseObj.imageUrl);
                });

            mT = new messageTemplate.messageTemplateModel();
            callback(mT.buildGenericMessage(eM.getElementModel()),sessionId);
        }
        else if(type=='cruiseCodeNotFound') {
            responseObj.forEach(function(cruiseObj){
                bM = new buttonModel.buttonModel();
                bM.buildPayLoadButton("postback",cruiseObj.destination, "LOCATION_"+ cruiseObj.destination);
            });
            mT = new messageTemplate.messageTemplateModel();
            callback(mT.buildButtonMessage("Select any of the location below",bM.getButtonsList()),sessionId);
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


