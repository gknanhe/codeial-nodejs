
const Post = require('../models/post');
const User = require('../models/user');



const Comment = require('../models/comment');
const { db } = require('../models/post');
 


module.exports.home = async function (req, res){
    //reading cookie
    // console.log(req.cookies);
    // res.cookie('user_id', 33);
    //it directly sends response
    // return res.end('<h1>Expres is up </h1>');

    //render() direcly looks for file in views folder as we set view engine views to views
    // populate({ 
    //     path: 'comments',
    //      populate: { path: 'user' } 
        
    //     })

    try {
        let  posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                        path:'user',
                        // model:'User'
                        
                    },
            populate: {
                        path: 'likes'
            }
        }).populate('comments')
        .populate('likes');



   




// for(post of posts){
//     let comme = post.comments;
//     comme.sort('-1');
//     console.log(comme,'comme')
// }

    

        // let comm = await Comment.find({})
        // .sort('-createdAt');

        // console.log('comm model',comm)
    

        let users = await User.find({});
        

        return res.render('home', {
            title : 'Codeal | Home',
            posts: posts,
            all_users: users
        })
    } catch (error) {
        console.log('error in getting post ',error)
    }
    
}

