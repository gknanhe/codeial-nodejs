const express = require('express');

const router = express.Router();

//call controller
const homeController = require('../controllers/home_controller');

console.log('router loaded');
//when empty req is comming go to this controller
router.get('/',homeController.home);


module.exports = router;