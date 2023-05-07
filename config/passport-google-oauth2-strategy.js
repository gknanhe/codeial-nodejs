const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');  //lib to generate random password
const User = require('../models/user');

//tell passport to use a new strategy for Google login
passport.use(new googleStrategy({
    clientID: "986366199498-kohkntveac7hfl9vtbre9d4lc5hf9lhi.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},

    async function(accessToken, refreshToken, profile, done){
        try {
            //find a user
            const user = await User.findOne({ email: profile.emails[0].value });
            console.log(profile,'****profile');

            if(user){
               // if found, set this user as req.user
                return done(null, user);
            }else{

                //if not found, create the user and set this as req.user
                const newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),   //will generate 20dig random pass
                })

                console.log(newUser,'***newUser');
                return done(null, newUser);
            }

        } catch (error) {
            console.log('Error in google-strategy passport', error);
            return;
        }
    }

));;



module.exports = passport;