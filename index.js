const express = require('express');
const app = express();
const port = 8000;

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