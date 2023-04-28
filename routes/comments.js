const expess = require('express');
const router = expess.Router();
//import passport to check is not authenticated cant post
const passport = require('passport');




const commentController = require('../controllers/comments_controller');
//create comment route
router.post('/create',passport.checkAuthentication, commentController.create);

//delete comment route
router.get('/destroy/:id', passport.checkAuthentication, commentController.destroy);
module.exports = router;