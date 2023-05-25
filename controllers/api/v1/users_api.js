const User = require('../../../models/user');
const jwt = require('jsonwebtoken');   // to kcreate token
const env = require('../../../config/environment');
module.exports.createSession = async function (req, res) {
    console.log(req.body, "email")

    try {

        let user = await User.findOne({ email: req.body.email });
        console.log(user,'******user')
        if (!user || user.password != req.body.password) {
            return res.json(422, {
                message: "Invalid Username or Password"
            });
        }

        return res.json(200, {
            message: 'Sing in successful, here is your token, please keep it safe ',
            token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: '100000' }),  //conver user to obj and encript by key and generat token
        })

    } catch (error) {

        console.log("*****", error);
        return res.json(500, {
            message: 'Internal Server Error'
        });

    }
}