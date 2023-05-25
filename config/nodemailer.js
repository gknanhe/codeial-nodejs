const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { getMaxListeners } = require('process');
require('dotenv').config();
const smtpTransport = require('nodemailer-smtp-transport')  //MOST IMP
const env = require('../config/environment');


const transporter = nodemailer.createTransport(smtpTransport(env.smtp));



let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailer', relativePath),
        data,
        function( err, template){
            if(err){console.log('error in rendering template',err); return;}

            mailHTML = template;
        }
    )

    return mailHTML;
}




    




module.exports = {
   transporter: transporter,
   renderTemplate: renderTemplate 
}