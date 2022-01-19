const Pizza = require('../../../models/pizza').Pizza;

function customerPizzaController() {
    return{

        getAllPizza(req, res) {
            console.log('customer get all pizza');
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

module.exports = customerPizzaController;