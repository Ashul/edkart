var mongoose = require('mongoose');
var userModel = mongoose.model('User');


exports.checkLogin = function(req, res, next){
    if(!req.user && !req.session.user){
        res.redirect('/user/login/screen');
    }else{
        next();
    }
}
