const expess = require('express');
const router = expess.Router();
//import passport to check is not authenticated cant post
const passport = require('passport');




const commentController = require('../controllers/comments_controller');

router.post('/create',passport.checkAuthentication, commentController.create);

module.exports = router;