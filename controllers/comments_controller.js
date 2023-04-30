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
                    req.flash('success', "Comment Added" );
                    return res.redirect('back');
                } catch (err) {
                    req.flash('error', err );
                    return res.redirect('back');
                }
                
                

            } catch (error) {
                req.flash('error', error );
            }
        }else{
            req.flash('error', error );
        }
    } catch (error) {
        req.flash('error', error );
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
            req.flash('success', 'Comment deleted' );

            return res.redirect('back')

        }
    } catch (error) {
        req.flash('error', error );
        return res.redirect('back')

    }
   
}