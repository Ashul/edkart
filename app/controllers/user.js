//required modules
var express = require('express');
var mongoose = require('mongoose');

//get the model
var User = mongoose.model('User');

//router middleware
var userRouter = express.Router();

//use responseGenerator library
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require('./../../middleware/auth')

module.exports.Controller = function(app){
    //get signup screen view
    userRouter.get('/signup/screen', function(req, res){
        res.render('signup');
    })
    
    //get login screen view
    userRouter.get('/login/screen', function(req, res){
        res.render('login')
    })
    //get dashboard screen view
    userRouter.get('/dashboard', auth.checkLogin, function(req, res){
        res.render('dashboard',{user : req.session.user})
    })
    //update view
    userRouter.get('/update', function(req, res){
    res.render('update')
    })


    //get all user
    userRouter.get('/all', function(req, res){
        User.find({}, function(err, user){
            if(err){
                    var myResponse = responseGenerator.generate(true, "some error occured"+ err, 500, null);
                    res.render('error',{
                        message : response.message,
                        error   : myResponse.data
                    });
            }
            res.send(user);
        })
    });
    
//>>>>>>>>>>>>>>>>>>>> signup API <<<<<<<<<<<<<<<<<<<<<<<<<
    userRouter.post('/signup', function(req, res){

        if(req.body.firstName != undefined && req.body.lastName != undefined && req.body.mobile != undefined && req.body.email != undefined && req.body.password != undefined){
            var newUser = new User({
                userName        :       req.body.firstName+req.body.lastName,
                firstName       :       req.body.firstName,
                lastName        :       req.body.lastName,
                email           :       req.body.email,
                mobile          :       req.body.mobile,
                password        :       req.body.password
            });
            newUser.save(function(err){
                if(err){
                    var myResponse = responseGenerator.generate(true, "some error occured"+ err, 500, null);
                    res.render('error',{
                        message : response.message,
                        error   : myResponse.data
                    });
                }
                else{
                    req.session.user = newUser;
                    delete req.session.user.password;
                    res.redirect('/user/dashboard');                
                }
            })
        }else{
            var myResponse = {
                error       :   true,
                message     :   "Some body paramater is missing",
                status      :   403,
                data        :   null
            }
             res.render('error')

        }
    });

//>>>>>>>>>>>>>>>>>>>>>>>>>>> Log In API<<<<<<<<<<<<<<<<<<<<<<<<<<<<
userRouter.post('/login', function(req, res){
    User.findOne({$and:[{'email':req.body.email},{'password':req.body.password}]}, function(err, foundUser){
        if(err){
            var myResponse = responseGenerator.generate(true, "some error occured"+err, 500, null);
            res.render('error',{
                message  :  response.message,
                error    :  responseGenerator.data
            });
        }else if(foundUser == null || foundUser == undefined || foundUser.userName == undefined){
            res.render('error');
        }else{
                    req.session.user = foundUser;
                    delete req.session.user.password;
                    res.redirect('/user/dashboard');                
        }
    })
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Log Out API <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
userRouter.get('/logout', function(req, res){
     req.session.destroy(function(err){
        if(err){
            var myResponse = responseGenerator.generate(true, "some error occured"+err, 500, null);
            res.render('error',{
                message  :  response.message,
                error    :  responseGenerator.data
            });
        }else{alert("user Logged Out")}
    });
         res.redirect('/user/login/screen')
    });

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Forgot password API <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
userRouter.post('/update', function(req, res){
    User.findOne({'email':req.body.email}, function(err, user){
        user.password = req.body.password;
        
         user.save(function(err){
        if(err){
            var myResponse = responseGenerator.generate(true, "ome error occured"+err, 500, null);
            res.render('error',{
                message :  response.message,
                error   :  response.data
            });
        }else{
            alert('password reset')
            res.redirect('/user/login/screen')
        }
         
    })
})
});


    //using middleware
    app.use('/user', userRouter);
}
