const express = require("express");
const passport = require("passport");
const router = express.Router();

// const passport = require('passport');

//export userController
const userController = require("../controllers/user_controller");

//user want o go to profile then use this routes
//make profile accessible on if signed in
router.get(
  "/profile/:id",
  passport.checkAuthentication,
  userController.profile
);
router.post("/update/:id", passport.checkAuthentication, userController.update);

router.get("/sign-in", userController.signIn);
router.get("/sign-up", userController.singUp);

//forget password
router.get("/forgot-password", userController.forgotPassword);
router.get("/change-password/:id", userController.changePassword);
router.post("/reset-password", userController.resetPassword);
router.post("/updatePassword/:id", userController.updatePassword);

router.post("/create", userController.create);

router.post(
  "/create-session",
  passport.authenticate(
    "local", //strategy
    { failureRedirect: "/users/sign-in" } // in case if session fails
  ),
  userController.createSession
); /*---> here if authentication fails 
redirect to sign in pahe and if done smoothly then go to next userController.createSession */

//sign out
router.get("/sign-out", userController.destroySession);

//for google Auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
); //will send to google by requestig for profile and email as mentioned in scope
//after auth from google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  userController.createSession
);

module.exports = router;
