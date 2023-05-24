const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.toggleFriend = async function(req,res){
    try{
        let deleted=false;
        let existing = null;
        let existing2 = null;

         existing = await Friendship.findOne({from_user:req.user.id,to_user:req.query.id});
         existing2 = await Friendship.findOne({from_user:req.query.id,to_user:req.user.id});
        // console.log(existing);
        // console.log(existing2);

        let user1 = await User.findById(req.user.id);
        let user2 = await User.findById(req.query.id);
        if(existing){
            //already friends
            // console.log(existing)
            user1.friendships.pull(existing._id);
            user2.friendships.pull(existing._id);
            existing.deleteOne();
            user1.save();
            user2.save();
          deleted=true ; 

        }
        else if(existing2){
            user1.friendships.pull(existing2.id);
            user2.friendships.pull(existing2.id);
            existing2.deleteOne();
            user1.save();
            user2.save();
          deleted=true ;
        }
        else{
            //create friend
            let newFriend = await Friendship.create({
                from_user:req.user.id,
                to_user:req.query.id
            });
            user1.friendships.push(newFriend._id);
            user2.friendships.push(newFriend._id);
            user1.save();
            user2.save();
        }
           // console.log(newFriend,user1.friendships,user2.friendships);
            return res.json(200,{
                message:'request successful',
                data:{
                    deleted:deleted
                }
            })

        

    }catch(err){
        console.log(err);
        return res.json(500,{
            message:'Internal Server Error'
        });
    }
}