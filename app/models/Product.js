var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    productName         :       {type:String, default:'', required:true},
    type                :       {type:String},
    title               :       {type:String},
    description         :       {type:String},
    price               :       {type:Number,required:true},
    image               :       {type:String},
    attributes          :       {}       
});

var Product = mongoose.model('Product', productSchema);