const express = require('express');

const router = express.Router();

const friendsController = require('../controllers/friend_controller');

router.post('/toggle',friendsController.toggleFriend);

module.exports = router;