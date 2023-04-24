const express = require('express');

const router = express.Router();

//call controller
const homeController = require('../controllers/home_controller');

console.log('router loaded');
//when empty req is comming go to this controller
router.get('/',homeController.home);


//anather controller for user
//if url is /user then go to this file
router.use('/users', require('./users'));


//router for post
router.use('/posts', require('./posts'));

/* general syntax*/
//for any further routes, access from here
//router.use('/routerName', require('./routerFile'));

module.exports = router;