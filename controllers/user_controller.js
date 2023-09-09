const { render } = require("ejs");
const mongoose = require("mongoose");

//export model
const User = require("../models/user");
const Friendship = require("../models/friendship");
const fs = require("fs");
const path = require("path");

const resetEmailWorker = require("../workers/resetPassword_mailer");
const queue = require("../config/kue");
const Token = require("../models/token");

module.exports.profile = async function (req, res) {
  try {
    // return res.end('<h1>User Profile</h1>');
    const user = await User.findById(req.params.id);

    let friend1 = await Friendship.findOne({
      from_user: req.params.id,
      to_user: req.user.id,
    });
    let friend2 = await Friendship.findOne({
      from_user: req.user.id,
      to_user: req.params.id,
    });

    let friends = false;
    if (friend1 || friend2) {
      friends = true;
    }

    return res.render("profile", {
      title: "Profile",
      profile_user: user,
      friends: friends,
    });
  } catch (error) {
    console.log(err);
  }
};

//update user datails
module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);

      //as its multipart/formdata cant use params DIRECTLY so will use static functions
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("******Multer Error: ", err);
        }

        user.name = req.body.name;
        user.email = req.body.email;

        //as user not gonna upload profile every time
        if (req.file) {
          //if already exist file remove it
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }

          //this is saving the path of the uploaded file in the avatar field in the user
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }

        user.save();
        req.flash("success", "Updated!");

        return res.redirect("back");
      });
    } catch (error) {
      console.log("cant update", error);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized!");
    return res.status(401).send("Unauthorized");
  }
};

//render sing up page
module.exports.singUp = function (req, res) {
  //if already signed in cant go to sign in again
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "Codeial | Sing Up",
  });
};

//render sign in page
module.exports.signIn = function (req, res) {
  //if already signed up cant go to sign in again
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_in", {
    title: "Codeial | Sing In",
  });
};

//get sign up data
module.exports.create = async function (req, res) {
  //check if password and confirm password is same
  if (req.body.password !== req.body.confirm_password) {
    req.flash("error", "Passwords Not Same!");

    return res.redirect("back");
  }
  try {
    //check if user exist
    const user = await User.findOne({ email: req.body.email });

    //if not exist creat it
    if (!user) {
      try {
        let newUser = await User.create(req.body);
        console.log(newUser, "*****");
        req.flash("success", "User created successfully");

        return res.redirect("/users/sign-in");
      } catch (err) {
        req.flash("error", err);
        return res.redirect("back");
      }
    } else {
      req.flash("error", "User Already Exist");

      return res.redirect("back");
    }
  } catch (err) {
    console.log("error in findig user in signing up");
    return;
  }
};

//sign in and creat a session for user using expess-sessio n and PASSPORT.JS
module.exports.createSession = function (req, res) {
  //set flash
  req.flash("success", "Logged in Successfully");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  //function from passport
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });

  req.flash("success", "You have Logged Out!");

  return res.redirect("/");
};

//reset password

//render the forgot password page for user
module.exports.forgotPassword = function (req, res) {
  res.render("forgot_password", {
    title: "Reset Password",
  });
};

//create token and send link to email for password change
module.exports.resetPassword = async function (req, res) {
  // console.log(req.body);
  let user = await User.findOne({ email: req.body.email });
  //console.log(user);
  let token = await Token.create({ isValid: true, user: user });
  console.log(token, "token sent");

  let job = queue.create("reset", token).save(function (err) {
    if (err) {
      console.log("error in creating queue", err);
      return;
    }
    console.log("enqueued", job.id, job);
  });
  res.render("reset_email_sent", {
    title: "Mail Inbox",
  });
};

//render the update password page
module.exports.changePassword = async function (req, res) {
  console.log("ainside cahnge password in user controller", req.params.id);
  let token = await Token.findById(req.params.id);
  if (!token || token.isValid == false) {
    res.render("user_sign_in", {
      title: "signIn",
    });
    return;
  } else {
    console.log("type of  req. param.id ", typeof req.params.id);
    // const userId =  new mongoose.Types.ObjectId(req.params.id);
    // console.log(typeof (userId));

    let token = await Token.findByIdAndUpdate(req.params.id, { isValid: true });
    console.log(token, "token");
    // let user = await User.findById(token.user);
    // console.log(user,'usercheck');
    res.render("changePassword", {
      title: "changePassword",
      user: token.user,
    });
  }
};

module.exports.updatePassword = async function (req, res) {
  console.log("inside  update password ", req.params.id);
  console.log(req.body);
  const userId = new mongoose.Types.ObjectId(req.params.id);

  // let user = await User.findById(userId);

  const user = await User.findOne({ _id: userId });

  console.log(user);
  try {
    if (req.body.password != req.body.confirm_password) {
      console.log("password not matching");
      //console.log(req.body.password, req.body.confirm_password);
      return res.redirect("back");
    }
    // console.log(req.params.id,'params')
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      console.log("not found user ", user);
      res.render("user_sign_up", {
        title: "signUp",
      });
      return;
    } else {
      console.log("found user ", user);

      await User.findByIdAndUpdate(user.id, { password: req.body.password });
      console.log("changedddd******");
      console.log(user.password);
      res.render("user_sign_in", {
        title: "SignIn",
      });
    }
  } catch (error) {
    console.log("error ", error);
    return;
  }
};
