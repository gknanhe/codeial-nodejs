
console.log('jsFile')
{
    let makeFriend = function(){
    let toggleFriend = $('#toggle-friend');
  //  console.log(toggleFriend);
    toggleFriend.click(function(e){
       
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: $(toggleFriend).attr('href'),
        }).done(function(data){
          //  console.log(data.data.deleted);
          if(data.data.deleted==false)red();
          else green(); 
           

        }).fail(function(errData) {
                console.log('error in completing the request');
            });
    })
}

let green = function(){
    //let friendStyle = $('#friend-style')
    let toggleFriend = document.getElementById('toggle-friend');
    let friendStyle = document.getElementById('friend-style');
    console.log(friendStyle);
    // friendStyle.style.backgroundColor = 'blue';
    toggleFriend.innerText = 'Add Friend';
}

let red = function(){
    // let friendStyle = $('#friend-style')
    let friendStyle = document.getElementById('friend-style');
    let toggleFriend = document.getElementById('toggle-friend');
    //console.log(friendStyle);
    // friendStyle.style.backgroundColor = 'red';
    toggleFriend.innerText = 'Remove Friend';
    friendStyle.style.color = 'white';
}


makeFriend();
}