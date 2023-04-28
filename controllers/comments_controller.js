const Comment = require('../models/comment');
const Post = require('../models/post');


//create commnet
module.exports.create = async function (req, res) {
    // console.log(req.body.post, 'idpost')
    try {
        let post = await Post.findById(req.body.post);
        // console.log(post, 'post');

        if (post) {
            // console.log('inside if')
            try {
                let comment = await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                });

                // console.log(comment,'comment')
                post.comments.push(comment);
                // console.log('post value after pushing',post)

                try {
                    await post.save();
                    console.log('Comment added to post!');
                    return res.redirect('back');
                } catch (err) {
                    console.log('Error saving post after comment', err);
                    return res.redirect('back');
                }
                
                

            } catch (error) {
                console.log('error in creating comment', error);
            }
        }else{
            console.log('Could not find post with id', req.body.post)
        }
    } catch (error) {
        console.log('error in finding  post');
    }
}


//delete comments
module.exports.destroy = async function(req, res){
    try {
        
        const comment =  await Comment.findById(req.params.id);

        if(comment.user == req.user.id){

            let postId = comment.post;

            await comment.deleteOne();

            await Post.findByIdAndUpdate( postId, { $pull: { comments: req.params.id }});
            console.log(' comment deleted');

            return res.redirect('back')

        }
    } catch (error) {
        console.log('error in finding comment');
        return res.redirect('back')

    }
   
}