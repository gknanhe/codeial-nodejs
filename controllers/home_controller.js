const Post = require("../models/post");
const User = require("../models/user");
const Friendship = require("../models/friendship");

const Comment = require("../models/comment");
const { db } = require("../models/post");

module.exports.home = async function (req, res) {
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
    // let posts = await Post.find({})
    //   .sort("-createdAt")
    //   .populate("user")
    //   .populate({
    //     path: "comments",
    //     populate: {
    //       path: "user",
    //       // model:'User'

    //       model: "User",
    //       select: "name",
    //     },
    //     populate: {
    //       path: "likes",
    //     },
    //   })
    //   .populate("comments")
    //   .populate("likes");

    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: [
          {
            path: "user",
            model: "User",
            select: "name",
          },
          {
            path: "likes",
            model: "Like",
          },
        ],
      })
      .populate("likes");

    console.log(posts);

    let friends = await Friendship.find({ from_user: req.user });
    //console.log(friends);
    for (let i = 0; i < friends.length; i++) {
      await friends[i].populate("to_user");
    }

    // for(post of posts){
    //     let comme = post.comments;
    //     comme.sort('-1');
    //     console.log(comme,'comme')
    // }

    // let comm = await Comment.find({})
    // .sort('-createdAt');

    console.log("friends", friends);

    let users = await User.find({});

    return res.render("home", {
      title: "Codeal | Home",
      posts: posts,
      all_users: users,
      friends: friends,
      req_url: req.headers.host,
    });
  } catch (error) {
    console.log("error in getting post ", error);
  }
};
