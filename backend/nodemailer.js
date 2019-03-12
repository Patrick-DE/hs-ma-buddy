"use strict";
const nodemailer = require("nodemailer");
var UserController = require('./controllers/user.controller');
let transporter = null;

function createTransporter(){

  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS // generated ethereal password
    }
  });

}

function sendMessage(_userId, action){
    if(transporter === null) createTransporter();

    UserController.user_detail(_userId, function(err, user){
        if(err || !user) return console.log(`sendMail with userId ${_userId} returned: ${user}, ${err}.`);
        var _to = user.email;
        var _subject = "There are news!";
        var _text = `Hallo ${_to.split('.')[0]},
        Es gibt Änderungen in deinen Terminen.\r\n
        Ein Termin wurde ${action}. \r\n
        Uns ist es leider nicht gestattet personenbezogene Daten per Email zu verschicken.\r\n
        Bitte gehe auf ${process.env.MOODLE_REDIRECT_URL} um die Änderungen einzusehen.\r\n
        \r\n
        Mit freundlichen Grüßen\r\n
        Buddy4You\r\n
        \r\n
        Do not reply to this email. All messages will be dropped or destroyed and never read!`;
    var _html = ``;

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"Buddy4You👻" <${process.env.SMTP_MAIL}>`, // sender address
        to: _to, // list of receivers
        subject: _subject, // Subject line
        text: _text, // plain text body
        html: _html // html body
    };

    // send mail with defined transport object
    let info = transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
}

//sendMessage().catch(console.error);