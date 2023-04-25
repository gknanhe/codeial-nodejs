const { render } = require("ejs")


//export model 
const User = require('../models/user');

module.exports.profile = function (req, res) {
    // return res.end('<h1>User Profile</h1>');

    return res.render('profile', {
        title: 'Profile'
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

                return res.redirect('/users/sign-in');
            } catch (err) {
                console.log("error in creating user");
            }
            
        }
        else{
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
    return res.redirect('/')
}


module.exports.destroySession = function(req, res){
   
   //function from passport 
    req.logout( function(err) {
    if(err){ return next(err);}
   } ); 
    
    return res.redirect('/');
}