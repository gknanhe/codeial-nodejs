// console.log('linked to likes')
// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleLike();
  }

  toggleLike() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = this;

      // this is a new way of writing ajax which you might've studied, it looks like the same as promises
      $.ajax({
        type: "POST",
        url: $(self).attr("href"),
      })
        .done(function (data) {
          let likesCount = parseInt($(self).attr("data-likes"));
          let prevLikesCount = likesCount;
          console.log(likesCount);
          console.log(data.data.deleted);
          if (data.data.deleted == true) {
            likesCount -= 1;
          } else {
            likesCount += 1;
          }

          $(self).attr("data-likes", likesCount);
          if (likesCount == prevLikesCount + 1) {
            $(self).html(`
                
                
              



              <svg xmlns="http://www.w3.org/2000/svg" width="39.081" height="35.176" viewBox="0 0 39.081 35.176">
              <path id="Red-Like-Icon-09uh" d="M257.329,9.511a11.035,11.035,0,0,0-15.606-.053l-.705.7-.7-.7A11.035,11.035,0,1,0,224.659,25l.7.7,15.552,15.66,15.66-15.553.7-.7a11.035,11.035,0,0,0,.053-15.606" transform="translate(-221.453 -6.194)" fill="#e74e5f"/>
            </svg>
            

              <span>${likesCount}</span>
                
                

              



                `);
          } else {
            $(self).html(`
                
              
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
          

            <span>${likesCount}</span>
              
              

            



              `);
          }
        })
        .fail(function (errData) {
          console.log("error in completing the request");
        });
    });
  }
}
