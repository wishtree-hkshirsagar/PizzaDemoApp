const Pizza = require('../../../models/pizza').Pizza;
const Outlet = require('../../../models/outlet').Outlet;

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

        removeFromCart(req, res){

            if(!req.session.cart) {
                return res.status(500).json({
                    message: 'Cart is empty'
                })
            }

            let cart = req.session.cart;

            if(cart.items[req.body.uniqueId].qty > 0) {
                cart.items[req.body.uniqueId].qty = cart.items[req.body.uniqueId].qty - 1;
                cart.totalQty = cart.totalQty - 1;
                cart.totalPrice = cart.totalPrice - req.body.price;
                return res.status(200).json({
                    totalQty: req.session.cart.totalQty,
                    totalPrice: req.session.cart.totalPrice,
                    items: cart.items
                });
            } else {
                return res.status(500).json({
                    message: `You don't have ${req.body.title} pizza in your cart to remove`
                })
            }
             
        },

        emptyCart(req, res){

            if(!req.session.cart) {
                return res.status(500).json({
                    message: "You don't have any items in your cart"
                })
            } else {
                delete req.session.cart;
                return res.status(200).json({
                    message: 'Cart deleted successfully!'
                })
            }

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

               return res.send(pizza);
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

                return res.send(pizza);
            })
        },

        getAllOutlets(req, res) {
            console.log('get all outlets');
            let query = Outlet.find({outletStatus : true}).select({'_id': 0});
            query.exec(function(err, outlet){
                console.log('outlet', outlet);
                
                if(err){
                    return res. status(500).json({
                        message: 'Something went wrong'
                    })
                }

                if(!outlet){
                    return res.status(404).json({
                        message: 'Data not found'
                    })
                }
               
                return res.send(outlet)
            })
        },

        getOutlet(req, res){
            let query = Outlet.findOne({uniqueId: req.params.id}).select({'_id': 0, 'name': 0, 'address': 0, 'ownerName': 0, 'uniqueId': 0, 'outletStatus': 0, 'createdAt': 0, 'updatedAt': 0, '__v': 0});

            let ownerId;
            query.exec(function(err, outlet){
                if(err){
                    return res.status(500).json({
                        message: 'Something went wrong'
                    })
                }
 
                if(!outlet){
                    return res.status(404).json({
                        message: 'Data not found'
                    })
                }
                ownerId = outlet.ownerId;
                console.log('OWNER ID',ownerId);

                let query1 = Pizza.find({ownerId: ownerId}).select({'_id': 0});
                query1.exec(function(err, pizza){

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

                    return res.send(pizza);
                })
               
            })

            
         }
    }
}

module.exports = publicController;