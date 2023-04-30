module.exports.setFlash = function(req, res, next){
    //will create an object in response in locals
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }

    next();
}