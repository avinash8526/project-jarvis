var mailer = {};
var fbUtils = require('./fbUtils');

mailer.mailDetails = function(destinationCode, to, cb,sessionId) {

	var cruiseApi = require('../utils/cruiseApi')

	var parameters = {
		destinations : destinationCode
	};

	var callback = function(data) {
		var ejs = require('EJS');
		fs = require('fs')
		str = fs.readFileSync(__dirname + '/template.ejs', 'utf8'); 

		var destinationName = cruiseApi.getNameFromCode(destinationCode, 'destination');
		var title = "Cruises to " + destinationName;
		data.title = title;
		data.sailings = data.processedData;

		var html = ejs.render(str, {data : data});
		

		var nodemailer = require("nodemailer");
		var config = require('../config/config');

		var smtpTransport = nodemailer.createTransport('SMTP', {
		   host: config.smtp.host,

		   auth: {
		       user: config.smtp.auth.user,
		       pass: config.smtp.auth.pass
		   },
		   
		});

		var fakeContext = {};
		var sendMail = function(to, subject, text) {
			smtpTransport.sendMail({
			    to: to, 
			    from : config.smtp.from,
			    subject: subject, 
			    html: text 
				}, function(error, response){
			    if(error){
			       console.log(error);
					sendMessageToFbFromMailer("Mailing server error",sessionId);
					cb(fakeContext);
			       return false;
			    } else{

			    	console.log('sent');
					sendMessageToFbFromMailer("Please check your email",sessionId);
					cb(fakeContext);
			       return true;
			    }
			});


		};


		sendMail(to, title, html);
	};

	cruiseApi.makeApiCall(parameters, callback);

};


function sendMessageToFbFromMailer(message,sessionId) {
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

module.exports = mailer;