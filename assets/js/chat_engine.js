class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;

    this.socket = io.connect("http://localhost:2000");
    //if email is present of user then only establish the connection
    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    let self = this;

    this.socket.on("connect", function () {
      console.log("connection established using sockets....!");

      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: "codeial",
      });

      self.socket.on("user_joined", function (data) {
        console.log("a user joined!", data);
      });
    });

    function scrollToBottom() {
      var chatMessagesList = $("#chat-messages-list");
      chatMessagesList.animate(
        { scrollTop: chatMessagesList.prop("scrollHeight") },
        500
      );
    }

    $("#send-message").click(function () {
      let msg = $("#chat-message-input").val();
      if (msg != "") {
        self.socket.emit("send_message", {
          message: msg,
          user_email: self.userEmail,
          chatroom: "codeial",
        });
      }

      $("#chat-message-input").val("");

      scrollToBottom();
    });

    function extractUsernameFromEmail(email) {
      const atIndex = email.indexOf("@");
      if (atIndex !== -1) {
        return email.slice(0, atIndex);
      } else {
        // Handle the case where there's no "@" symbol in the email
        return email;
      }
    }

    self.socket.on("receive_message", function (data) {
      // console.log('message received',data.message);

      let newMessage = $("<li>");

      let messageType = "other-message";
      if (data.user_email == self.userEmail) {
        messageType = "self-message";
      }

      let userName = extractUsernameFromEmail(data.user_email);

      newMessage.append(
        $("<span>", {
          html: data.message,
        })
      );
      newMessage.append(
        $("<sub>", {
          // html: data.user_email,
          html: userName,
        })
      );
      newMessage.addClass(messageType);

      $("#chat-messages-list").append(newMessage);

      scrollToBottom();
    });
  }
}

// function scrollToBottom() {
//   var chatMessagesList = $("#chat-messages-list");
//   chatMessagesList.animate(
//     { scrollTop: chatMessagesList.prop("scrollHeight") },
//     500
//   );
// }

$("#chat-circle").click(function () {
  $("#chat-circle").toggle("scale");
  $(".chat-box").toggle("scale");

  if ($("#chat-circle").is(":visible")) {
    $("#chat-circle ").css("display", "flex");
  } else {
    $("#chat-circle ").css("display", "none");
  }
});

$(".chat-box-toggle").click(function () {
  $("#chat-circle").toggle("scale");
  $(".chat-box").toggle("scale");

  // Center the SVG when the chat circle becomes visible
  if ($("#chat-circle").is(":visible")) {
    $("#chat-circle ").css("display", "flex");
  } else {
    $("#chat-circle ").css("display", "none");
  }
});
