const express = require('express');
const router = express.Router();

//export userController
const userController = require('../controllers/user_controller');


//user want o go to profile then use this routes
router.get('/profile',userController.profile );

router.get('/sign-in', userController.signIn);
router.get('/sign-up', userController.singUp);



router.post('/create', userController.create)

module.exports = router;