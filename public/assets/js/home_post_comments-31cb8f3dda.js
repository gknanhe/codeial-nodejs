class PostComments{constructor(e){console.log("oooo"),this.postId=e,this.postContainer=$(`#post-${e}`),this.newCommentForm=$(`#post-${e}-comments-form`),this.createComment(e);let t=this;$(" .delete-comment-button",this.postContainer).each((function(e){t.deleteComment($(this))}))}createComment(e){let t=this;console.log(t,"pself"),this.newCommentForm.submit((function(o){o.preventDefault();console.log(this,"self"),$.ajax({type:"post",url:"/comments/create",data:$(this).serialize(),success:function(o){let n=t.newCommentDom(o.data.comment);$(`#post-comments-${e}`).prepend(n),t.deleteComment($(" .delete-comment-button",n)),new ToggleLike($(" .toggle-like-button",n)),new Noty({theme:"relax",text:"Comment published!",type:"success",layout:"topRight",timeout:1500}).show(),document.getElementById("comment-input").value=""},error:function(e){console.log(e.responseText)}})}))}newCommentDom(e){return $(`<li id="comment-${e._id}">\n        <p>\n                <small>\n                    <a class="delete-comment-button" href="/comments/destroy/${e._id}">X</a>\n                </small>\n\n            ${e.content}\n            <br>\n            <small>\n                ${e.user.name}\n    \n            </small>\n            <small>\n                            \n                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${e._id}&type=Comment">\n                    0 Likes\n                </a>\n        \n            </small>\n           </p> \n    </li>`)}deleteComment(e){$(e).click((function(t){t.preventDefault(),$.ajax({type:"get",url:$(e).prop("href"),success:function(e){console.log(e.data,"dataCommentfrom"),$(`#comment-${e.data.comment_id}`).remove(),new Noty({theme:"relax",text:"Comment Deleted",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log(e.responseText)}})}))}}