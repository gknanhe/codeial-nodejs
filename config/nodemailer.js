const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { getMaxListeners } = require('process');
require('dotenv').config();
const smtpTransport = require('nodemailer-smtp-transport')

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;
const cliId = process.env.OAUTH_CLIENTID;
const secret = process.env.OAUTH_CLIENT_SECRET;
const rtoken = process.env.OAUTH_REFRESH_TOKEN;
console.log(email,pass,cliId,secret,rtoken)

const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',//'smtp.gmail.com',   // hosting service 
    port: 587,
    secure: false,
    
    auth: {
        user:  'iam.nanhe33@gmail.com', //process.env.EMAIL,//'iam.nanhe33@gmail.com',   //gmail
        pass: process.env.EMAIL_PASS,//'iiuotnmpvyernogu'  //genrated pass //pass of gmail
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    
    
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
            if(err){console.log('error in rendering template'); return;}

            mailHTML = template;
        }
    )

    return mailHTML;
}




    




module.exports = {
   transporter: transporter,
   renderTemplate: renderTemplate 
}