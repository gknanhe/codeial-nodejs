const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');



module.exports.toggleLike = async function(req, res){
    try {
        
        //likes/toggle/?id=abcs&type=Post
        let likeable;
        let deleted = false;

        if(req.query.type === "Post"){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');

        }

        // console.log(req.query,'query')
        // console.log(req.user,'user')
        //check if like  already exist
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel:req.query.type,
            user: req.user._id,
        });

        // console.log(existingLike,'existing likes')
        //if a like already exist then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            

            existingLike.deleteOne();
            deleted = true;

        }else{
            //make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type,
            });


            likeable.likes.push(newLike._id);
            likeable.save();
        }


        return res.status(200).json( {
            message: 'Request successful',
            data: {
                deleted: deleted,

            }
        })
        
        
    } catch (error) {
        console.log('error',error);
        return res.json(500,{
            message: 'Internal server error'
        })
    }
}