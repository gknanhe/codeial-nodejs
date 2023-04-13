const express = require('express');
const app = express();
const port = 8000;

//use express router using middleware
app.use('/',require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error : ${err}`);
        return;
    }

    console.log(`runnig on port: ${port}`);
})