module.exports.home = function (req, res){
    //reading cookie
    console.log(req.cookies);
    res.cookie('user_id', 33);
    //it directly sends response
    // return res.end('<h1>Expres is up </h1>');

    //render() direcly looks for file in views folder as we set view engine views to views
    return res.render('home', {
        title : 'Home'
    })
}

