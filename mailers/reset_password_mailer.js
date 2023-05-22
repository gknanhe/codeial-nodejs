const nodeMailer = require('../config/nodemailer');


exports.reset=(data)=>{
   
    let htmlString = nodeMailer.renderTemplate({data},'/resetPassword/reset_password.ejs')
    
    nodeMailer.transporter.sendMail({
        from:"iam.nanhe33@gmail.com",
        to:data.user.email,
        subject:"Link for Reset Password",
        html:htmlString
    },(err,info)=>{
        if(err){console.log('error in sending mail',err);return;}
      //  console.log('mail delivered',info);
        return;
    });
    }
    