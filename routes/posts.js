const expess = require('express');
const router = expess.Router();
//import passport to check is not authenticated cant post
const passport = require('passport');




const postController = require('../controllers/posts_controller');

router.post('/create',passport.checkAuthentication, postController.create);

module.exports = router;