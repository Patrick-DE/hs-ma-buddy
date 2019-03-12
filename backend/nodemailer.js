"use strict";
const nodemailer = require("nodemailer");
var UserController = require('./controllers/user.controller');
let transporter = null;

function createTransporter(){

    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: (process.env.SMTP_SECURE === 'true'), // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
    });

}

exports.sendMessage = function(_userId, action) {
    if(transporter === null){
        createTransporter();
    }

    UserController.user_detail(_userId, function(err, user){
        if(err || !user) return console.log(`sendMail with userId ${_userId} returned: ${user}, ${err}.`);

        var _to = user.email;
        var _subject = "There are news!";
        //formating here does make a difference!
        var _text = `Hallo ${user.first_name},
Es gibt Änderungen in deinen Terminen.

Ein Termin wurde ${action}.
Uns ist es leider nicht gestattet personenbezogene Daten per Email zu verschicken.
Bitte gehe auf ${process.env.MOODLE_REDIRECT_URL} um die Änderungen einzusehen.

Mit freundlichen Grüßen
Buddy4You

Do not reply to this email. All messages will be dropped or destroyed and never read!`;

        // setup email data with unicode symbols
        let mailOptions = {
            from: `"Buddy4You👻" <${process.env.SMTP_USER}>`, // sender address
            to: _to, // list of receivers
            subject: _subject, // Subject line
            text: _text, // plain text body
            dsn: {
                id: 'some random message specific id',
                return: 'headers',
                notify: ['failure', 'delay'],
                recipient: process.env.SMTP_USER
            }
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return console.log("Email not send: "+ error);
    
            console.log('Message sent successfully!');
            console.log("Message sent: %s", info.messageId);
        });
    });
}

//sendMessage().catch(console.error);