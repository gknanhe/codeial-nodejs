const express = require('express');
const app = express();
const port = 8000;

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