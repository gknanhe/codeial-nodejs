
const Post = require('../models/post');
module.exports.home = async function (req, res){
    //reading cookie
    console.log(req.cookies);
    res.cookie('user_id', 33);
    //it directly sends response
    // return res.end('<h1>Expres is up </h1>');

    //render() direcly looks for file in views folder as we set view engine views to views
    // populate({ 
    //     path: 'comments',
    //      populate: { path: 'user' } 
        
    //     })

    try {
        let  posts = await Post.find()
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                        path:'user',
                        // model:'User'
                    }
        }
    );
    
        // console.log(posts)
        // for(let post of posts){
            
        //     // console.log(post.comments)
        //     if (Array.isArray(post.comments)) {
        //         console.log(post.comment)
        //         for(comment of post.comments){
        //             console.log(comment.user.name, comment.content)
        //         }
        //     }
            
        //     console.log('completed')
        // }
        

        return res.render('home', {
            title : 'Codeal | Home',
            posts: posts
        })
    } catch (error) {
        console.log('error in getting post ',error)
    }
    
}

