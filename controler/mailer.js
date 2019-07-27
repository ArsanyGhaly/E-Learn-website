var nodemailer = require('nodemailer');


 var transport = nodemailer.createTransport({
 	  service:'Gmail',
      auth: {
           user: 'arsany.ghaly2015@gmail.com',
           pass: 'Arsany37148612##'
      }
   });

module.exports= {
	sendEmail(mailOptions){
		
	   transport.sendMail(mailOptions,(err,info)=>{
		if (err) {
			console.log(err)
		  }else{
			console.log('Email sent: '+info.response);
				}
				
			});

		
}
}