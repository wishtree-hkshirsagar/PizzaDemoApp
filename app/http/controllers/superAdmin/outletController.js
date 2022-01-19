const Outlet = require('../../../models/outlet').Outlet;
const User = require('../../../models/user').User;
const crypto = require('crypto');

function outletController() {
    return {
         createOutlet(req, res) {
            console.log('owner id', req.body.ownerId);
          
            if(!req.body.name || !req.body.address){
                return res.status(400).send({error: "Invalid parameters. Please provide all the required information."});
            }

               User.findOne({_id: req.body.ownerId}, function(err, user){
               console.log('user', user);
               console.log('user role', user.role);
              
               if(!user){
                   return res.status(404).json({
                       message: 'Invalid parameter. Please provide user id'
                   })
               }
            
               if(user.role !== 'admin'){
                   return res.status(401).json({
                       message: 'Unauthorized user'
                   })
               }
           })

            const id = crypto.randomBytes(16).toString('hex');
            let newOutlet = new Outlet({
                name: req.body.name,
                address: req.body.address,
                ownerId: req.body.ownerId,
                uniqueId: id
            });

            newOutlet.save().then((result) => {
                return res.status(200).json({
                    message: 'Outlet created successfully!',
                    outlet: newOutlet
                });
            }).catch((error) => {
                return res.status(501).json({
                    message: 'Something went wrong'
                })
            })
        },

        getAllOutlets(req, res){
            let query = Outlet.find({}).select({'_id': 0});
            query.exec(function(err, outlet){
                console.log('59', outlet);
                
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

                return res.status(200).json({
                    outlet: outlet
                })
            })
        },

        getOutlet(req, res){
           let query = Outlet.findOne({uniqueId: req.params.id}).select({'_id': 0});
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

               return res.status(200).json({
                   outlet: outlet
               })
           })
        },

        updateOutlet(req, res){
            
            Outlet.findOne({uniqueId: req.params.id}, function(err, outlet){
                console.log('outlet', outlet);
                
                if(!outlet){
                    return res.status(404).json({
                        message: 'Data not found'
                    })
                }else{
                    try{
                        if(req.body.name){
                            outlet.name = req.body.name;
                        }

                        if(req.body.address){
                            outlet.address = req.body.address;
                        }

                        if(req.body.ownerId){
                            outlet.ownerId = req.body.ownerId;
                        }

                        outlet.save(() => {
                            return res.status(200).json({
                                message: 'Outlet updated successfully!'
                            })
                        })
                    } catch(error){
                        return res.status(501).json({
                            message: 'Something went wrong'
                        })
                    }
                }
            });
        },

        deleteOutlet(req, res){
            Outlet.deleteOne({uniqueId: req.params.id}, function(err){
                if(err){
                    return res.status(500).json({
                        message: 'Error in deleting outlet'
                    })
                }

                return res.status(200).json({
                    message: 'Outlet deleted successfully!'
                })
            })
        }
    }
}

module.exports = outletController;