
const Post = require('../models/post');
module.exports.home = async function (req, res){
    //reading cookie
    console.log(req.cookies);
    res.cookie('user_id', 33);
    //it directly sends response
    // return res.end('<h1>Expres is up </h1>');

    //render() direcly looks for file in views folder as we set view engine views to views

    

    try {
        const posts = await Post.find().populate('user');

        return res.render('home', {
            title : 'Codeal | Home',
            posts: posts
        })
    } catch (error) {
        console.log('error in getting post ')
    }
    
}

