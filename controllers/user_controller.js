const { render } = require("ejs")


//export model 
const User = require('../models/user');

module.exports.profile = async function (req, res) {
    // return res.end('<h1>User Profile</h1>');
    const user = await User.findById(req.params.id);
    return res.render('profile', {
        title: 'Profile',
        profile_user: user
    })

}


//render sing up page
module.exports.singUp = function (req, res) {

    //if already signed in cant go to sign in again
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sing Up",
    });
}

//render sign in page
module.exports.signIn = function (req, res) {

    //if already signed up cant go to sign in again
    if(req.isAuthenticated()){
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
        const user = await User.findOne({ email: req.body.email });
        //if not exist creat it
        if (!user) {
            try {
                let newUser = await User.create(req.body)
                console.log(newUser, "*****");
                req.flash('success', 'User created successfully');

                return res.redirect('/users/sign-in');
            } catch (err) {
                req.flash('error', err );
                return res.redirect('back');

            }
            
        }
        else{
            req.flash('error', "User Already Exist" );

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


module.exports.destroySession = function(req, res){

   //function from passport 
    req.logout( function(err) {
    if(err){ return next(err);}
   } ); 

   req.flash('success', 'You have Logged Out!');

    return res.redirect('/');
}