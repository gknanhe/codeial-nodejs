const passport = require('passport');


const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true    //alow to pass 1st arg as req
},
    async function (req, email, password, done) {
        //find a user and establish the identity
        try {
            // console.log('email', email, 'password', password );
            const user = await User.findOne({ email: email })
            // console.log('emailServ', user.email, 'passwordServ', user.password );


            if (!user || user.password != password) {
                
                req.flash('error','Invalid Username / Password');

                return done(null, false);
            }

            return done(null, user);

        } catch (err) {
            req.flash('error',err);
            return done(err);
        }
    }


));


// serialize the user to decide which is to be kept in cookies
passport.serializeUser(function (user, done) {
    done(null, user.id);
})

// deserializing the user from the key in the cookie
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        if (user) {
            return done(null, user)
        }

    } catch (err) {
        console.log('Error in finding user --> passport');
        return done(err);
    }


});

// middleware function to check if user loggedin and data saved in localss

// check if the user is authenticated 
passport.checkAuthentication = function (req, res, next) {
    // if user is signed in, then pass on the req to next function (controllers action)
    if (req.isAuthenticated()) {
        return next();
    }

    // if not signed in then send to signed in
    return res.redirect('/users/sign-in');
}


passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        // req.user contains the current signed in user from the session coookie and we are just sending to locals for the views
        // console.log(req.user,'req user')
        res.locals.user = req.user;
        // console.log(res.locals.user,'req locals user')

    }

    next();
}

module.exports = passport;