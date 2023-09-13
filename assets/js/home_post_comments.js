// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX
class PostComments {
  // constructor is used to initialize the instance of the class whenever a new instance is created
  constructor(postId) {
    // console.log("oooo");
    (this.postId = postId), (this.postContainer = $(`#post-${postId}`));
    this.newCommentForm = $(`#post-${postId}-comments-form`);

    this.createComment(postId);

    let self = this; //this -> object -> {postid: postId, postContainer:   ,newCommentForm:    ,createComment:    }
    //call for all the existing comments
    $(" .delete-comment-button", this.postContainer).each(function (e) {
      self.deleteComment($(this));
    });
  }

  createComment(postId) {
    let pSelf = this;
    // console.log(pSelf, "pself");

    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let self = this;
      // console.log(self, "self");

      $.ajax({
        type: "post",
        url: "/comments/create",
        data: $(self).serialize(),
        success: function (data) {
          let newComment = pSelf.newCommentDom(data.data.comment);
          $(`#post-comments-${postId}`).prepend(newComment);
          pSelf.deleteComment($(" .delete-comment-button", newComment));

          // CHANGE :: enable the functionality of the toggle like button on the new comment
          new ToggleLike($(" .toggle-like-button", newComment));

          new Noty({
            theme: "relax",
            text: "Comment published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();

          document.getElementById("comment-input").value = "";
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }

  newCommentDom(comment) {
    // console.log("comment", comment);
    // CHANGE :: show the count of zero likes on this comment

    return $(
      //     `<li id="comment-${comment._id}">
      //     <p>
      //             <small>
      //                 <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
      //             </small>

      //         ${comment.content}
      //         <br>
      //         <small>
      //             ${comment.user.name}

      //         </small>
      //         <small>

      //             <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
      //                 0 Likes
      //             </a>

      //         </small>
      //        </p>
      // </li>`

      `
    <div class="postCommentsItem" id="comment-${comment._id}">
    <div class="deletePostComment">
    <a class="delete-comment-button" href="/comments/destroy/${comment._id}"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-x"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </a>
  </div>
  <div class="postCommentHeader">
    <span class="postCommentAuther">${comment.user.name}</span>
    <span class="postCommentTime"> ${this.printPostDate(
      comment.updatedAt
    )}</span>
    <!-- {/* <span class="postCommentLikes}>22</span> */} -->
  </div>
  <div class="postCommentContent">${comment.content}</div>
  <div class="postLike">
  <button>
    <a
      class="toggle-like-button"
      data-likes="${comment.likes.length}"
      href="/likes/toggle/?id=${comment._id}&type=Comment"
    >
    <svg
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
          ></path>
        </svg>
        <span>${comment.likes.length}</span>
      </a>



</div>`
    );
  }

  //Method to set the date on which the post was created in the correct format.
  printPostDate(dat) {
    let date = dat;
    date = new Date(date);
    const day = date.getDate();
    const year = date.getFullYear();
    const monthWord = date.toLocaleString("default", {
      month: "short",
    });
    const time = date.toLocaleTimeString("default", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const today = day + " " + monthWord + ", " + year;
    const format = today + " | " + time;
    return format;
  }

  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          // console.log(data.data, "dataCommentfrom");

          $(`#comment-${data.data.comment_id}`).remove();

          new Noty({
            theme: "relax",
            text: "Comment Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }
}
