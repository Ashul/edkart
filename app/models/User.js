//required modules
var mongoose = require('mongoose');

// define a schema
var Schema = mongoose.Schema;

// make instance of Schema
var userSchema = new Schema({
    userName        :       {type:String, default:''},
    firstName       :       {type:String},
    lastName        :       {type:String},
    email           :       {type:String},
    mobile          :       {type:Number},
    password        :       {type:String}

});

//deifne a model
mongoose.model('User', userSchema);