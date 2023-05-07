const { render } = require("ejs")


//export model 
const User = require('../models/user');

const fs = require('fs');
const path = require('path');

module.exports.profile = async function (req, res) {
    // return res.end('<h1>User Profile</h1>');
    const user = await User.findById(req.params.id);
    return res.render('profile', {
        title: 'Profile',
        profile_user: user
    })

}

//update user datails
module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);

            //as its multipart/formdata cant use params DIRECTLY so will use static functions
            User.uploadedAvatar(req, res, function (err) {
                if (err) { console.log('******Multer Error: ', err); }

                user.name = req.body.name;
                user.email = req.body.email;

                //as user not gonna upload profile every time
                if(req.file){

                    //if already exist file remove it
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname , '..', user.avatar))
                    }



                    //this is saving the path of the uploaded file in the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;

                }

                user.save();
                req.flash('success', 'Updated!');

                return res.redirect('back');

            });
 
        } catch (error) {

            console.log('cant update', error);
            return res.redirect('back');
        }


    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }

}


//render sing up page
module.exports.singUp = function (req, res) {

    //if already signed in cant go to sign in again
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sing Up",
    });
}

//render sign in page
module.exports.signIn = function (req, res) {

    //if already signed up cant go to sign in again
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_in', {
        title: "Codeial | Sing In",
    });
}

//get sign up data 
module.exports.create = async function (req, res) {
    //check if password and confirm password is same
    if (req.body.password !== req.body.confirm_password) {

        req.flash('error', 'Passwords Not Same!');

        return res.redirect('back');

    }
    try {
        //check if user exist
        const user = await User.findOne({email: req.body.email});


        //if not exist creat it
        if (!user) {
            try {
                let newUser = await User.create(req.body)
                console.log(newUser, "*****");
                req.flash('success', 'User created successfully');

                return res.redirect('/users/sign-in');
            } catch (err) {
                req.flash('error', err);
                return res.redirect('back');

            }

        }
        else {
            req.flash('error', "User Already Exist");

            return res.redirect('back');
        }
    }
    catch (err) {
        console.log('error in findig user in signing up');
        return;
    }


}

//sign in and creat a session for user using expess-sessio n and PASSPORT.JS
module.exports.createSession = function (req, res) {
    //set flash 
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/')
}


module.exports.destroySession = function (req, res) {

    //function from passport 
    req.logout(function (err) {
        if (err) { return next(err); }
    });

    req.flash('success', 'You have Logged Out!');

    return res.redirect('/');
}