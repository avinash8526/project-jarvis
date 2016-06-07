var mailer = {};

mailer.mailDetails = function(destinationCode, to) {

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
		data.sailings = data;

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

		var sendMail = function(to, subject, text) {
			smtpTransport.sendMail({
			    to: to, 
			    from : config.smtp.from,
			    subject: subject, 
			    html: text 
				}, function(error, response){
			    if(error){
			       console.log(error)
			       return false;
			    } else{
			    	console.log('sent')
			       return true;
			    }
			});
		};


		sendMail(to, title, html);
	};

	cruiseApi.makeApiCall(parameters, callback);

};

module.exports = mailer;