const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const cookieParser = require('cookie-parser');
const port = 8000;

const db = require('./config/mongoose');
// const { urlencoded } = require('express');

//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo'); // lib to store session info
//scss middleware to convert scss into css
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');   //to show flash notification
const customMware = require('./config/middleware');


app.use(sassMiddleware({
    src: './assets/scss',   //src to look for scss files
    dest: './assets/css',  //where to store converted files
    debug: true,
    outputStyle: 'expanded' ,  //css will be extended
    prefix: '/css'   //where to look for css files
}))

//to read through req use urlEncoder
app.use(express.urlencoded());

//use cookie parseer
app.use(cookieParser()); 

// app.use(express.static('./assets'));
        // OR
app.use(express.static(__dirname + '/assets'));//if used this then include / in css link at start

//route for avatar path
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(expressLayouts);
// extract styles and script from sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);





//set view engine to ejs
app.set('view engine', 'ejs');

//set views to views folder
app.set('views', './views');




//set up middleware for cookie encryption
// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial' ,  //name of cookie
    secret: 'blahsomething',   // encryption done with this words
    saveUninitialized: false,
    resave: false,
    //session time 
    cookie: {
        maxAge: (1000 * 60 * 100)  //in ms
    },

    store:  MongoStore.create({
            mongoUrl: 'mongodb://localhost/codeial_developement', 
            autoRemove: 'disabled'
        })
}))

//for passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)


//use flash after session set up
app.use(flash());//session info stored and need to send to next page
app.use(customMware.setFlash);


//use express router using middleware

//any request use this routes
app.use('/',require('./routes'));





app.listen(port, function(err){
    if(err){
        console.log(`Error : ${err}`);
        return;
    }

    console.log(`runnig on port: ${port}`);
})