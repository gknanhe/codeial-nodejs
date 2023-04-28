const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
   
        try {
            let newPost = await Post.create({
                content: req.body.content,
                user: req.user._id
            })
            // console.log(newPost, "newPost");

            return res.redirect('back');
        } catch (err) {
            console.log("error in creating Post");
        }
   

}


//delete post

module.exports.destroy = async function(req, res){
    console.log('params ', req.params);
   const post = await Post.findById(req.params.id);
    try {
        //_id is converted in to string id to compare by mongoose
        if (post.user == req.user.id ){
            await post.deleteOne();

            try {
                await Comment.deleteMany({post: req.params.id});
                console.log("Data deleted"); // Success
                return res.redirect('back')

            } catch (error) {
                console.log('error in delete');
                return res.redirect('back')

            }
          
          
        }else{
            console.log('user not same');
            return res.redirect('back');

        }
    } catch (error) {
        console.log('error in deleting post ')
    }
   
}