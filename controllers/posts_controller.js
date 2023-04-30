const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {

    try {
        await Post.create({
            content: req.body.content,
            user: req.user._id
        })
        // console.log(newPost, "newPost");
        req.flash('success', "Post published" );

        return res.redirect('back');
    } catch (err) {
        req.flash('error', err );
        return res.redirect('back');

    }


}


//delete post

module.exports.destroy = async function (req, res) {
    console.log('params ', req.params);
    const post = await Post.findById(req.params.id);
    try {
        //_id is converted in to string id to compare by mongoose
        if (post.user == req.user.id) {
            await post.deleteOne();
            //although no need of nested tryCatch bcoz if err occurs next part wont execute
            try {
                await Comment.deleteMany({ post: req.params.id });
                req.flash('success', "Post deleted" );
                return res.redirect('back')

            } catch (error) {
                req.flash('error', err );
                return res.redirect('back')

            }


        } else {
            req.flash('error', "Can't delete" );
            return res.redirect('back');

        }
    } catch (error) {
        req.flash('error', "Can't delete" );
        return res.redirect('back');
    }

}