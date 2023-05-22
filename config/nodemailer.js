const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { getMaxListeners } = require('process');
require('dotenv').config();
const smtpTransport = require('nodemailer-smtp-transport')  //MOST IMP



const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',//'smtp.gmail.com',   // hosting service 
    port: 587,
    secure: false,
    
    auth: {
            /*for this code taken help from freecode camp
        https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/
            */

        user:  'iam.nanhe33@gmail.com', //process.env.EMAIL,//'iam.nanhe33@gmail.com',   //gmail
        pass: process.env.EMAIL_PASS,//'iiuotnmpvyernogu'  //genrated pass //pass of gmail
        clientId: process.env.OAUTH_CLIENTID,   
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN    /** generate it from: https://developers.google.com/oauthplayground */
    
    
    },
    tls: {
        rejectUnauthorized: false,
    }

}));



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