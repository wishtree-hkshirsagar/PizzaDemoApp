const nodemailer = require('nodemailer');
const properties = require('../config/properties');

module.exports = {

    sendOtp: function(email, otp){
        console.log('send otp', email, otp);

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: true,
            auth: {
                user: properties.USER_EMAIL,
                pass: properties.USER_PASSWORD
            }
        });

        var mailOptions = {
            from: properties.USER_EMAIL,
            to: email,
            subject: 'One Time Password',
            text: 'This One Time Password is valid for 5 minutes :'+otp
        };

        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log('error')
                console.log(error);
            }else{
                console.log(response);
            }
        });
    }
}