const express = require('express');
const router = express.Router();

//export userController
const userController = require('../controllers/user_controller');


//user want o go to profile then use this routes
router.get('/profile',userController.profile );

module.exports = router;