const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 8000;

// app.use(express.static('./assets'));
        // OR
app.use(express.static(__dirname + '/assets'));//if used this then include / in css link at start
app.use(expressLayouts);
// extract styles and script from sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//use express router using middleware

//any request use this routes
app.use('/',require('./routes'));

//set view engine to ejs
app.set('view engine', 'ejs');

//set views to views folder
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        console.log(`Error : ${err}`);
        return;
    }

    console.log(`runnig on port: ${port}`);
})