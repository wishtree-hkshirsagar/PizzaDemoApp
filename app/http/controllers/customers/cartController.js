
function cartController(){
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
        }
    }
}

module.exports = cartController;