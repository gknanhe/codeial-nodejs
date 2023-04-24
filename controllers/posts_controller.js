const Post = require('../models/post');

module.exports.create = async function(req, res){

   
        try {
            let newPost = await Post.create({
                content: req.body.content,
                user: req.user._id
            })
            console.log(newPost, "newPost");

            return res.redirect('back');
        } catch (err) {
            console.log("error in creating Post");
        }
   

}
