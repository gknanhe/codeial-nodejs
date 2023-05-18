const nodeMailer = require('../config/nodemailer');


//this is another way of exporting a method
exports.newComment =  async (comment) => {
    console.log('inside newComment mailer',comment.user.email);



        
            const info = await nodeMailer.transporter.sendMail({
                from: 'iam.nanhe33@gmail.com',
                to:  comment.user.email,
                subject: 'New Comment Published!',
                html: '<h1>Yup, your comment published!</h1>'
            }
            , (err, info) => {
                if (err) {

                    console.log('Error in sending mail', err);
                    return;
                }

                console.log('message sent', info);
                return;
            
            });
        
   
}