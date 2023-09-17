const express = require("express");
const router = express.Router();

//call controller
const homeController = require("../controllers/home_controller");
const peoplesController = require("../controllers/peoples_controller");
console.log("router loaded");
//when empty req is comming go to this controller
router.get("/", homeController.home);

//peoples
router.get("/peoples", peoplesController.allPeoples);

//anather controller for user
//if url is /user then go to this file
router.use("/users", require("./users"));

//router for post
router.use("/posts", require("./posts"));

//router for comments
router.use("/comments", require("./comments"));

//router for likes
router.use("/likes", require("./likes"));

//router for friendship
router.use("/friends", require("./friends"));

/* general syntax*/
//for any further routes, access from here
//router.use('/routerName', require('./routerFile'));

// for API
router.use("/api", require("./api"));

module.exports = router;
