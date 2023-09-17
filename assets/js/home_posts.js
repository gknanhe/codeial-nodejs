{
  // method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();
      // console.log("serialize", newPostForm.serialize());
      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          // console.log(data.data.post);
          let newPost = newPostDom(data.data.post); //after success data will be printed
          $("#post-list-container").prepend(newPost); //prepend erlier
          deletePost($(" .delete-post-button", newPost));

          //call the create comment class
          new PostComments(data.data.post._id);

          //CHANGE :: enable the functionality of the toggle like button on the post
          new ToggleLike($(" .toggle-like-button", newPost));

          //for flash notification
          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });

      document.getElementById("form-input").value = "";
    });
  };

  let newPostDom = function (post) {
    // console.log("post", post);
    // CHANGE :: show the count of zero likes on this post
    return $(
      `<div class="postContainer" id="post-${post._id}" key="{post._id}">
    <div class="postWrapper">
      <div class="postHeader">
        <div class="postAvatar">
          <div>
            <img
              class="user-avatar create-post-avatar"
              src="${post.user.avatar}"
              alt=" ${post.user.name}"
              onclick="window.location.href='/users/profile/${post.user._id}'"
              loading="lazy"
            />
            
          
            <div class="userNameContainer">
              <a href="/users/profile/${post.user._id}" class="postAuther">
                ${post.user.name}
              </a>
              <span class="postTime"> ${this.printPostDateBefore(
                post.createdAt
              )}       </span>
            </div>
          </div>
          <div class="deletePost">
          <a class="delete-post-button" href="/posts/destroy/${post._id}"
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
        </div>
        <div class="postContent">${post.content}</div>
  
        <div class="postActions">
          <div class="postLike">
            <button>
              <a
                class="toggle-like-button"
                data-likes="${post.likes.length}"
                href="/likes/toggle/?id=${post._id}&type=Post"
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
                <span>${post.likes.length}</span>
              </a>
            </button>
          </div>
  
          <div class="postCommentsIcon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2190/2190552.png"
              alt="comments-icon"
            />
            <span>${post.comments.length}</span> 
          </div>
        </div>
  
      
          <form
            id="post-${post._id}-comments-form"
            action="/comments/create"
            method="post"
          >
            <div class="postCommentBox">
              <textarea
                placeholder="Start typing a comment.."
                id="comment-input"
                type="text"
                name="content"
                required
              ></textarea>
              <div class="PostBtnContainer">
                <input type="hidden" name="post" value="${post._id}" />
                <input type="submit" value="Comment" />
              </div>
            </div>
          </form>
         
  
          <div class="postCommentsList">
            <div id="post-comments-${post._id}">
            </div>
          </div> 
  
          
      </div>
    </div>
  </div>
  `
    );
  };

  //method to delete post from DOM
  let deletePost = function (deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          // console.log(data.data);
          $(`#post-${data.data.post_id}`).remove(); //will remove class

          new Noty({
            theme: "relax",
            text: "Post Deleted",
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
  };

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function () {
    // console.log("inside convertAjax");
    // $("#post-list-container>ul>li").each(function () {
    $(".postContainer").each(function () {
      let self = $(this);
      // console.log(self);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop("id").split("-")[1];
      new PostComments(postId);
    });
  };

  function printPostDate() {
    // console.log("inside post date");
    const dateEle = document.querySelectorAll(".postTime");

    // console.log(dateEle);
    for (let i = 0; i < dateEle.length; i++) {
      // dateEle.forEach((item) => {
      // console.log(dateEle[i].textContent);
      let date = JSON.stringify(dateEle[i].textContent);
      date = new Date(date);
      const day = date.getDate();
      const month = date.getMonth();
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
      dateEle[i].textContent = format;
      // console.log("converted", dateEle[i].textContent);
    }
  }
  printPostDate();

  function printCommentDate() {
    const dateEle = document.querySelectorAll(".postCommentTime");

    // console.log(dateEle);
    for (let i = 0; i < dateEle.length; i++) {
      // dateEle.forEach((item) => {
      // console.log(dateEle[i].textContent);
      let date = JSON.stringify(dateEle[i].textContent);
      date = new Date(date);
      const day = date.getDate();
      const month = date.getMonth();
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
      dateEle[i].textContent = format;
      // console.log("converted", dateEle[i].textContent);
    }
  }
  printCommentDate();

  function printPostDateBefore(dat) {
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

  createPost();
  convertPostsToAjax();

  // console.log("hellow");
}

$(function () {
  $(".peopleContainer").slice(0, 4).show();
  $("#loadMore").on("click", function (e) {
    e.preventDefault();
    $(".peopleContainer:hidden").slice(0, 4).slideDown();
    if ($(".peopleContainer:hidden").length == 0) {
      $("#loadLess").fadeIn("slow");
      $("#loadMore").hide();
      // $("#loadMore").text('Load only the first 4');
    }
    $("html,body").animate(
      {
        slideDown: $(this).offset().top,
      },
      1500
    );
  });

  $("#loadLess").on("click", function (e) {
    e.preventDefault();
    $(".peopleContainer:not(:lt(4))").fadeOut();
    $("#loadMore").fadeIn("slow");
    $("#loadLess").hide();

    desiredHeight = $(window).height();

    // $("html, body").animate(
    //   {
    //     scrollTop: $(this).offset().top + desiredHeight,
    //   },
    //   1500
    // );
  });
});
