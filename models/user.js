const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required:true,
    }
}, {
    //to store user login log out timestamp
    timestamps: true,
})


const User = mongoose.model('User', userSchema);

module.exports = User;