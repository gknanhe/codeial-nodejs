const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;  // to extract req data
const env = require('../config/environment');
const User = require('../models/user');

let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret,
}

passport.use(new JWTStrategy(opts, async function(jwtPayLoad, done){  //jwtPayload will contain reqData
    try {
        const user = await User.findById(jwtPayLoad._id);
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }

    } catch (error) {
        console.log('Error in finding user from JWT', error);
        return;
    }


}));


module.exports = passport;