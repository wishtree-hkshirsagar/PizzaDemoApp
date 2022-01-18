const Pizza = require('../../../models/pizza').Pizza;

function publicController(){
    return {

        addToCart(req, res){

            if(!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }

            let cart = req.session.cart;

            if(!cart.items[req.body.uniqueId]) {
                cart.items[req.body.uniqueId] = {
                    item: req.body,
                    qty: 1
                }
        
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
        
            } else {
       
                cart.items[req.body.uniqueId].qty = cart.items[req.body.uniqueId].qty + 1;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price; 
        
            }

            return res.json({
                totalQty: req.session.cart.totalQty,
                totalPrice: req.session.cart.totalPrice,
                items: cart.items
            });
        },

        getCartItems(req, res){

            let obj = [];
    
            if(req.session.cart){
                for(let i of Object.values(req.session.cart.items)){
                    let obj1 = {};
                    
                    obj1.item = i.item;
                    obj1.item.qty = i.qty;
                    
                    obj.push(obj1);
                    
                }
                
                return res.json({
                    items: obj,
                    totalQty: req.session.cart.totalQty,
                    totalPrice: req.session.cart.totalPrice
                });
            }
        },

        getAllPizza(req, res) {
            
            let query = Pizza.find({}).select({'_id': 0});
            query.exec(function(err, pizza){
                
                if(err){
                    return res. status(500).json({
                        message: 'Something went wrong'
                    })
                }

                if(!pizza){
                    return res.status(404).json({
                        message: 'Data not found'
                    })
                }

                return res.status(200).json({
                    pizza: pizza
                })
            })
        },

        getPizza(req, res) {
            let query = Pizza.findOne({uniqueId: req.params.id}).select({'_id': 0});
            query.exec(function(err, pizza){
                if(err){
                    return res.status(500).json({
                        message: 'Something went wrong'
                    })
                }

                if(!pizza){
                    return res.status(404).json({
                        message: 'Data not found'
                    })
                }

                return res.status(200).json({
                    pizza: pizza
                })
            })
        },
    }
}

module.exports = publicController;