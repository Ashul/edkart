//required modules
var express = require('express');
var mongoose = require('mongoose');
var logger = require('morgan');
var session = require('express-session');//middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');
//required module ends

var app = express();

//view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname+'/app/views'));
//view engine setup ends

//middlewares initialized
app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb', extended:true}));
app.use(cookieParser());
app.use(session({
  name   : 'myCustomCookie',
  secret :  'myAppSecret',
  resave :  true,
  httpOnly :  true,
  saveUninitialized : true,
  cookie : {secure  : false}
}));
app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
})
//setup mongodb connection
var dbURI = 'mongodb://localhost/edkart';
mongoose.connect(dbURI);
mongoose.connection.once('connected', function(){
    console.log(dbURI + ' Database connection established')
});
//setup finished

//include all model files using fs module
fs.readdirSync('./app/models').forEach(function(file){
    
    //check if file is js or not
    if(file.indexOf('.js'));
    require('./app/models/'+file);
});

//include all controllers file using fs module
fs.readdirSync('./app/controllers').forEach(function(file){
  //check if file is js or not
  if(file.indexOf('.js'));
  var route = require('./app/controllers/'+file);
  route.Controller(app);
})

var auth = require('./middleware/auth');
var mongoose = require('mongoose');
var userModel = mongoose.model('User');

app.use(function(req, res, next){

    if(req.session && req.session.user){
        userModel.findOne({'email':req.session.user.email}, function(err){
            if(user){
                // req.user = user;
                // delete req.user.password;

                req.session.user = user;
                delete req.session.user.password;
                next();
            }else{
                //do nothing
            }
        });
    }else{
        next();
    }
});


app.listen(8000)