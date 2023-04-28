const Comment = require('../models/comment');
const Post = require('../models/post');



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