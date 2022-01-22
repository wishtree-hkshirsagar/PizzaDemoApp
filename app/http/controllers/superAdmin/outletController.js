const Outlet = require('../../../models/outlet').Outlet;
const User = require('../../../models/user').User;
const crypto = require('crypto');

function outletController() {
    return {
         createOutlet(req, res) {
            console.log('owner id', req.body.ownerId);
            let ownerName = null;
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

                ownerName = user.name;
           })

           Outlet.findOne({ownerId: req.body.ownerId}, function(err, outlet){
               if(err){
                   return res.status(500).json({
                       message: 'Something went wrong'
                   })
               }
               if(outlet){
                   return res.status(409).json({
                       message: 'User is already the owner of an outlet, try assigning a different user'
                   })
               }
           
            
            const id = crypto.randomBytes(16).toString('hex');
            let newOutlet = new Outlet({
                name: req.body.name,
                address: req.body.address,
                ownerId: req.body.ownerId,
                ownerName: ownerName,
                uniqueId: id
            });

            newOutlet.save().then((result) => {
                return res.status(200).json({
                    message: 'Outlet created successfully!'
                });
            }).catch((error) => {
                return res.status(501).json({
                    message: 'Something went wrong'
                })
            })

         })
        },

        getAllOutlets(req, res){
            let query = Outlet.find({}).select({'_id': 0});
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

        getAllActiveOutlets(req, res){
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

               return res.send(outlet)
           })
        },

        updateOutlet(req, res){
            
            Outlet.findOne({uniqueId: req.params.id}, function(err, outlet){
                console.log('outlet', outlet);
                console.log('outlet body', req.body)
                if(req.body.status){
                    console.log('******');
                }
                if(!outlet){
                    return res.status(404).json({
                        message: 'Data not found'
                    })
                }else{
                    try{
                        
                        if(outlet.ownerId.toString() !== req.body.ownerId){
                            Outlet.find({ownerId: req.body.ownerId}, function(err, outlet){

                                if(err){
                                    return res.status(500).json({
                                        message: 'Something went wrong'
                                    })
                                }
                                if(outlet){
                                    return res.status(409).json({
                                        message: 'User is already the owner of an outlet, try assigning a different user'
                                    })
                                }

                            });
                        } else {
                           
                            if(req.body.name){
                                console.log('inside name');
                                outlet.name = req.body.name;
                            }
    
                            if(req.body.address){
                                console.log('inside address');
                                outlet.address = req.body.address;
                            }
    
                            if(req.body.ownerId){
                                console.log('inside ownerId');
                                outlet.ownerId = req.body.ownerId;
                            }

                            
                            outlet.outletStatus = req.body.outletStatus;
                            
    
                            outlet.save(() => {
                                return res.status(200).json({
                                    message: 'Outlet updated successfully!'
                                })
                            })
                        }
                       
                       
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