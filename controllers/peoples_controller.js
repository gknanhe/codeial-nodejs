const User = require("../models/user");

module.exports.allPeoples = async function (req, res) {
  try {
    let users = await User.find({});

    return res.render("all_people", {
      title: "Codeal | User Friends",

      all_users: users,
      req_url: req.headers.host,
    });
  } catch (error) {
    console.log("error in getting friends of user ", error);
  }
};
