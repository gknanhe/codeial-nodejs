const queue= require('../config/kue');
const resetMailer = require('../mailers/reset_password_mailer');

queue.process('reset',function(job,done){
  //  console.log('worker tokens processing...job',job.data);
    resetMailer.reset(job.data);
    done();
})