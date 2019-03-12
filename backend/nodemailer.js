"use strict";
const nodemailer = require("nodemailer");
var UserController = require('./controllers/user.controller');
var Buddy = require('./models/buddy.model');
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

exports.notifyUser = function(_userId, _buddyId, action){
    UserController.user_detail(_userId, function(err, user){
        if(err || !user) return console.log(`sendMail with userId ${_userId} returned: ${JSON.stringify(err)}.`);
        exports.sendMessage(user.first_name, user.email, action);
    });

    if(_buddyId !== undefined){
        Buddy.findById(_buddyId, function(err, buddy){
            if(err || !buddy) return console.log(`sendMail with buddyId ${_buddyId} returned: ${JSON.stringify(err)}.`);
            exports.sendMessage(buddy.first_name, buddy.email, action);
        });
    }
}

exports.sendMessage = function(first_name, _to, action) {
    if(process.env.NODE_ENV !== "production") return;
    if(transporter === null){
        createTransporter();
    }

    var _subject = "There are news!";
    //formating here does make a difference!
    var _text = `Hallo ${first_name},
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
}
