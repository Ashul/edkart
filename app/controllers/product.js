//required modules

var express = require('express');
var mongoose = require('mongoose');

//get the model
var Product = mongoose.model('Product');
var Cart = require('../models/Cart');

//router middleware
var productRouter = express.Router();

//use responseGenerator library
var responseGenerator = require('./../../libs/responseGenerator');

module.exports.Controller = function(app){

    //get all products
    productRouter.get('/all', function(req, res){
        Product.find({}, function(err, product){
            if(err){
                    var myResponse = responseGenerator.generate(true, "some error occured"+ err, 500, null);
                    res.render('error',{
                        message : response.message,
                        error   : myResponse.data
                    });
            }else{
                // res.send(product)
                res.render('cart', {product: product})
            }
        })
    })

    //create a product
    productRouter.post('/create', function(req, res){
        var newProduct = new Product({
            productName         :       req.body.productName,
            type                :       req.body.type,
            title               :       req.body.title,
            description         :       req.body.description,
            price               :       req.body.price,
            image               :       req.body.image,
            attributes          :       req.body.attributes
        });

        newProduct.save(function(err, product){
            if(err){
                var myResponse = responseGenerator.generate(true, "some errror occured"+err, 500, null);
                res.render('error',{
                    message     :   myResponse.message,
                    error       :   myResponse.data
                })
            }else{
                res.redirect('/product/cart');                
            }
        })
    });


    //>>>>>>>>>>>>>>>>>>>>>>>>> view product info
    productRouter.get('/:id', function(req, res){
        Product.findById(req.params.id, function(err, product){
            if(err){
                    var myResponse = responseGenerator.generate(true, "some error occured"+err, 500, null);
                    res.render('error',{
                        message : myResponse.message,
                        error   : myResponse.data
                    });
            }else{
                res.send(product)
            }
        })
    })

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Edit a product
    productRouter.put('/:id/edit', function(req, res){
        Product.findById(req.params.id, function(err, product){
            product.productName         =       req.body.productName,
            product.type                =       req.body.type,
            product.title               =       req.body.title,
            product.description         =       req.body.description,
            product.price               =       req.body.price,
            product.image               =       req.body.image
            product.attributes          =       req.body.attributes

    
    product.save(function(err){
        if(err){
            var myResponse = responseGenerator.generate(true, "ome error occured"+err, 500, null);
            res.render('error',{
                message :  response.message,
                error   :  response.data
            });
        }else{
            console.log('product updated');
            res.send(product)

        }
    });
    });
    });

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Delete a product
    productRouter.post('/:id/delete', function(req, res){
        Product.findById(req.params.id, function(err, product){
            product.remove(function(err){
                if(err){
            var myResponse = responseGenerator.generate(true, "ome error occured"+err, 500, null);
            res.render('error',{
                message :  response.message,
                error   :  response.data
            });
                }else{
                    res.send('')
                }
            })
        })
    })

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Add to cart
productRouter.get('/cart/:id', function(req, res){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
    Product.findById(productId, function(err, product){
        if(err){
            var myResponse = responseGenerator.generate(true, "ome error occured"+err, 500, null);
            res.render('error',{
                message :  response.message,
                error   :  response.data
            });
        }else{

         cart.addProducts(product, product.id);
         req.session.cart = cart
         console.log(req.session.cart);
         res.redirect("/product/all")
}
    })
})
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Remove from cart
productRouter.get('/remove/:id', function(req, res){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart:{items:{}});
        cart.removeProducts(productId);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/product/all")
            

});
        app.use('/product', productRouter);

}