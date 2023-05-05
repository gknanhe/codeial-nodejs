const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {

    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        

        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name');

            return res.status(200).json({
                data: {
                    post: post
                },
                message: 'Post Created!',
            })
        }


        // console.log(newPost, "newPost");
        req.flash('success', "Post published" );

        return res.redirect('back');
    } catch (err) {
        req.flash('error', err );
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');

    }


}


//delete post

module.exports.destroy = async function (req, res) {

    
    try {

        let post = await Post.findById(req.params.id);
        //_id is converted in to string id to compare by mongoose
        if (post.user == req.user.id) {
            await post.deleteOne();
            //although no need of nested tryCatch bcoz if err occurs next part wont execute
            // try {
                await Comment.deleteMany({ post: req.params.id });

                if (req.xhr){
                    return res.status(200).json({
                        data: {
                            post_id: req.params.id
                        },
                        message: 'Post deleted!',
                    });
                }


                req.flash('success', " your Post deleted" );
                return res.redirect('back')

            // } catch (error) {
            //     req.flash('error', err );
            //     return res.redirect('back')

            // }


        } else {
            req.flash('error', "Can't delete" );
            return res.redirect('back');

        }
    } catch (error) {
        req.flash('error', "Can't delete" );
        console.log(error, 'error delete')
        return res.redirect('back');
    }

}