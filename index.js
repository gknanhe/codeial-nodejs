const express = require("express");
const env = require("./config/environment");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const app = express();

//helps in getting new css js files renamed
require("./config/view-helpers")(app);

const cookieParser = require("cookie-parser");
const port = 8000;

// env
require("dotenv").config();

const db = require("./config/mongoose");
// const { urlencoded } = require('express');

//body parsere
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extnded: true }));

//used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJwt = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo"); // lib to store session info
//scss middleware to convert scss into css
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash"); //to show flash notification
const customMware = require("./config/middleware");

//setup chat socket
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(2000);
console.log("chat server is listening on port 5000");
const path = require("path");

console.log("paths assets", path.join(__dirname, env.asset_path, "/css"));

if (env.name == "developement") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "/scss"), //src to look for scss files
      dest: path.join(__dirname, env.asset_path, "/css"), //where to store converted files
      debug: true,
      outputStyle: "extended", //css will be extended
      prefix: "/css", //where to look for css files
    })
  );
}

//to read through req use urlEncoder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//use cookie parseer
app.use(cookieParser());

// app.use(express.static('./assets'));
// OR
app.use(express.static(env.asset_path)); //if used this then include / in css link at start

//route for avatar path
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// extract styles and script from sub pages
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//set view engine to ejs
app.set("view engine", "ejs");

//set views to views folder
app.set("views", "./views");

//set up middleware for cookie encryption
// mongo store is used to store the session cookie in the db
app.use(
  session({
    name: "codeial", //name of cookie
    secret: env.session_cookie_key, // encryption done with this words
    saveUninitialized: false,
    resave: false,
    //session time
    cookie: {
      maxAge: 1000 * 60 * 100, //in ms
    },

    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/codeial_developement",
      autoRemove: "disabled",
    }),
  })
);

//for passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//use flash after session set up
app.use(flash()); //session info stored and need to send to next page
app.use(customMware.setFlash);

//use express router using middleware

//any request use this routes
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error : ${err}`);
    return;
  }

  console.log(`runnig on port: ${port}`);
});
