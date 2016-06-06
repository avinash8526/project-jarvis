var mailer = {};

mailer.mailDetails = function(data, to, subject) {

	var ejs = require('EJS');
	fs = require('fs')
	str = fs.readFileSync(__dirname + '/template.ejs', 'utf8'); 

	data =  {
		title : "My title",
		sailings : [{"cruiseLineName":"Norwegian Cruise Line","shipName":"Norwegian Epic","price":1798,"imageUrl":"https://s3.amazonaws.com/mediavault.le/media/8f6cfc705b7bcbe412b43ba81e25f47635a20383.jpeg","webUrl":"https://www.expedia.com/Cruise-Search?destination=caribbean&selected-option=cruise-line&cruise-line=undefined"},{"cruiseLineName":"Norwegian Cruise Line","shipName":"Norwegian Escape","price":1998,"imageUrl":"https://s3.amazonaws.com/mediavault.le/media/0288b1ff3bc504436dd697dd2f68365bb3b5418c.jpeg","webUrl":"https://www.expedia.com/Cruise-Search?destination=caribbean&selected-option=cruise-line&cruise-line=undefined"},
		{"cruiseLineName":"Norwegian Cruise Line","shipName":"Norwegian Epic","price":1598,"imageUrl":"https://s3.amazonaws.com/mediavault.le/media/8f6cfc705b7bcbe412b43ba81e25f47635a20383.jpeg","webUrl":"https://www.expedia.com/Cruise-Search?destination=caribbean&selected-option=cruise-line&cruise-line=undefined"}, {"cruiseLineName":"Norwegian Cruise Line","shipName":"Norwegian Epic","price":1718,"imageUrl":"https://s3.amazonaws.com/mediavault.le/media/8f6cfc705b7bcbe412b43ba81e25f47635a20383.jpeg","webUrl":"https://www.expedia.com/Cruise-Search?destination=caribbean&selected-option=cruise-line&cruise-line=undefined"},
		{"cruiseLineName":"Norwegian Cruise Line","shipName":"Norwegian Epic","price":1398,"imageUrl":"https://s3.amazonaws.com/mediavault.le/media/8f6cfc705b7bcbe412b43ba81e25f47635a20383.jpeg","webUrl":"https://www.expedia.com/Cruise-Search?destination=caribbean&selected-option=cruise-line&cruise-line=undefined"}, {"cruiseLineName":"Norwegian Cruise Line","shipName":"Norwegian Epic","price":1708,"imageUrl":"https://s3.amazonaws.com/mediavault.le/media/8f6cfc705b7bcbe412b43ba81e25f47635a20383.jpeg","webUrl":"https://www.expedia.com/Cruise-Search?destination=caribbean&selected-option=cruise-line&cruise-line=undefined"}]
	}

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


	sendMail('avagrawal@expedia.com', "Your Cruises", html);

};

module.exports = mailer;