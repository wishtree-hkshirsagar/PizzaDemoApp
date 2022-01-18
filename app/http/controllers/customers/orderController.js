const Order = require('../../../models/order').Order;
const stripe = require('stripe')('sk_test_51KFtEUCiI18G0MYYSMrYFvsLCzDF1T7gaugFNlx64gpnufN2eRD0RVyuFCxffg9FRfzv4PpsRBm00LWKpktNAyuI00t00uKcXe');
const crypto = require('crypto');

function orderController() {

    return{

        orderPizza(req, res){

            const { contactNumber, address, paymentType, stripeToken, outletId } = req.body;
            if(!contactNumber || !address || !outletId){
                return res.status(422).json({msg : "Error, All fields are required"});
            }

            const id = crypto.randomBytes(16).toString('hex');

            let newOrder = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                contactNumber: contactNumber,
                address: address,
                paymentType: paymentType,
                uniqueId: id,
                outletId: outletId
            });

            newOrder.save().then(result => {
                Order.populate(result, {path: 'customerId'}, (err, placedOrder) => {
                    if(placedOrder.paymentType === 'card'){
                        stripe.charges.create({ 
                            amount: req.session.cart.totalPrice  * 100,
                            description: `Pizza order id: ${placedOrder._id}`, 
                            currency: 'inr', 
                            source: stripeToken
                        }).then(() => {
                            placedOrder.paymentStatus = true
                            placedOrder.paymentType = paymentType
                            placedOrder.save().then((order) => {
                                console.log('587', order)
                                delete req.session.cart
                                return res.json({ message : 'Payment successful, Order placed successfully' });
                            }).catch((error) => {
                                console.log(error)
                            })
                        }).catch((error) => {
                            delete req.session.cart
                            return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                        })
                    } else {
                        delete req.session.cart
                        return res.json({ message : 'Order placed succesfully' });
                    }
                })
            }).catch(error => {
                return res.status(500).json({message: 'Something went wrong'});
            })
        },

        getOrders(req, res){

            let query = Order.find({
                customerId: req.user._id
            }).select({'_id': 0});
            query.exec(function(err, orders){
                
                if(err){
                    return res. status(500).json({
                        message: 'Something went wrong'
                    })
                }

                if(!orders || orders.length === 0){
                    return res.status(404).json({
                        message: 'Data not found'
                    })
                }

                return res.status(200).json({
                    order: orders
                })
            })
        },

        getOrder(req, res){
            let query = Order.findOne({uniqueId: req.params.id}).select({'_id': 0});
            query.exec(function(err, order){
                if(err){
                    return res.status(500).json({
                        message: 'Something went wrong'
                    })
                }

                if(!order){
                    return res.status(404).json({
                        message: 'Data not found'
                    })
                }

                if(req.user._id.toString() === order.customerId.toString()){
                   return res.status(200).json({
                       order: order
                    });
                }
            })
        }

    }
}

module.exports = orderController;