const express = require('express');
const passport = require('passport');
const router = express.Router();

const passportm = require('passport');

//export userController
const userController = require('../controllers/user_controller');


//user want o go to profile then use this routes
//make profile accessible on if signed in
router.get('/profile', passport.checkAuthentication, userController.profile );

router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.singUp);



router.post('/create', userController.create)

router.post('/create-session', passport.authenticate(
    'local', //strategy
    {failureRedirect: '/users/sign-in' }// in case if session fails
) ,userController.createSession)    /*---> here if authentication fails 
redirect to sign in pahe and if done smoothly then go to next userController.createSession */



//sign out 
router.get('/sign-out', userController.destroySession);

module.exports = router;