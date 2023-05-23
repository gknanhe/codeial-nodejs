{
    // method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);  //after success data will be printed
                    $('#post-list-container>ul').prepend(newPost);  //prepend erlier
                    deletePost($(' .delete-post-button', newPost));

                    //call the create comment class
                    new PostComments(data.data.post._id);

                    //CHANGE :: enable the functionality of the toggle like button on the post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    //for flash notification
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },
                error: function (error) {
                    console.log(error.responseText);
                }

            })

            document.getElementById('form-input').value = "";

        });



    }




    let newPostDom = function (post) {

        console.log(post.user);
         // CHANGE :: show the count of zero likes on this post
        return $(`<li id="post-${post._id}">
        <p>
           <small>
               <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
           </small>
           ${post.content}
        <br>
        <small>
        ${post.user.name}
        </small>

        <br>
             <small>
                            
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                    0 Likes
                </a>
                            
             </small>

        </p> 
   
    <div class="post-comments">
       
           <form id="post-${ post._id }-comments-form" action="/comments/create" method="post">
               <input type="text" name="content" placeholder="type something..." required>
               <input type="hidden" name="post" value="${post._id}">
               <input type="submit" value="Comment">
           </form>
       
       <div class="post-comments-list">
           <ul id="post-comments-${post._id}">
              
                   
           </ul>
       </div>
    </div>
    </li>`)

    }

    //method to delete post from DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    console.log(data.data)
                    $(`#post-${data.data.post_id}`).remove();   //will remove class
                    
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                


                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }




    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        console.log('inside convertAjax');
        $('#post-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }



    createPost();
    convertPostsToAjax();

}