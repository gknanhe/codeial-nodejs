const mongoose = require('mongoose');

const likeSchems = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
    },

    //this defines the object id of the liked object
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        refPath: 'onModel',
    },

    //this field is used for defining the type of the likes object since this is a dynamic referance
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment'],
    }
},{
    timestamps: true,
});


const Like = mongoose.model('Like', likeSchems);
module.exports = Like;