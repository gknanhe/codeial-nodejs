const Friendship = require("../models/friendship");

module.exports.userFriends = async function (req, res) {
  try {
    let friends = await Friendship.find({ from_user: req.user });
    //console.log(friends);
    for (let i = 0; i < friends.length; i++) {
      await friends[i].populate("to_user");
    }
    // console.log("req url: ", req.headers.host);

    return res.render("user_friends", {
      title: "Codeal | User Friends",

      friends: friends,
      req_url: req.headers.host,
    });
  } catch (error) {
    console.log("error in getting friends of user ", error);
  }
};
