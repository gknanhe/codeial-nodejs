const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");
const commentEmailWorker = require("../workers/comment_email_workers");
const queue = require("../config/kue");
const Like = require("../models/like");

//create commnet
module.exports.create = async function (req, res) {
  // console.log(req.body.post, 'idpost')
  try {
    let post = await Post.findById(req.body.post);
    // console.log(post, 'post');

    if (post) {
      // console.log('inside if')

      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      // console.log(comment,'comment')

      // post.comments.push(comment);
      post.comments.unshift(comment); //unshift add at start of array

      // console.log('post value after pushing',post)

      await post.save();

      // Similar for comments to fetch the user's id!
      // comment = await comment.populate('user', 'name email',);
      comment = await comment.populate("user", ["name", "email"]);

      console.log(comment);

      //send mail
      // commentsMailer.newComment(comment);

      // insted of sending directly emails we are sending by kue
      let job = queue.create("emails", comment).save(function (err) {
        if (err) {
          console.log("Error in creating the que", err);
          return;
        }

        console.log("job enqueued", job.id);
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment created!",
        });
      }

      req.flash("success", "CommentAdded");
      return res.redirect("back");

      // } catch (error) {
      //     req.flash('error', error );
      // }
    }
  } catch (error) {
    req.flash("error", error);
    return;
  }
};

//delete comments
module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postId = comment.post;

      let deleteComm = await comment.deleteOne();
      console.log(deleteComm, "comm delete");

      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      // CHANGE :: destroy the associated likes for this comment
      await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

      // send the comment id which was deleted back to the views
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment deleted",
        });
      }

      req.flash("success", "Commentdeleted");

      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", error);
    return res.redirect("back");
  }
};
