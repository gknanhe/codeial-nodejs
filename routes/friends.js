const express = require("express");

const router = express.Router();

const friendsController = require("../controllers/friend_controller");
const userFriendsController = require("../controllers/user_friends_controller");

router.post("/toggle", friendsController.toggleFriend);

router.get("/:id", userFriendsController.userFriends);

module.exports = router;
