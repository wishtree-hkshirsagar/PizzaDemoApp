const Pizza = require('../../../models/pizza').Pizza;
const multer = require('multer');
const crypto = require('crypto');


let uploadedfile;
function pizzaController() {
    return {


        uploadImage(req, res){

            function getTime() {
                var today = new Date().toLocaleDateString()
                today = today.toString().replace('/', '-')
                today = today.replace('/', '-')
        
                const date = new Date();
                let h = date.getHours();
                let m = date.getMinutes();
                let s = date.getSeconds();
        
                today += '-' + h + '-' + m + '-' + s
        
                return today;
            }

            var storage = multer.diskStorage({

                destination: (req, file, callBack) => {
                    callBack(null, './resources/images/app')
                },
                filename: (req, file, callBack) => {
                    callBack(null, `${getTime()}-${file.originalname}`)
                }
            })

            var upload = multer({
                storage: storage,
                fileFilter: (req, file, cb) => {
                   if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                       cb(null, true);
                     } else {
                       cb(null, false);
                       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
                     }
                }
               }).single('file');  

    
               upload(req, res, (err) =>{
                   uploadedfile = req.file;
                   console.log(uploadedfile);
                   if(err){
                       return res.status(500).json({
                        message: 'Error uploading pizza image'
                       });
                   }else{
                       console.log('Uploaded successfully...')
                      return res.status(200).json({
                        message: 'Image uploaded successfully!'
                      });
                   }
               });
        },

        addPizza(req, res){
            if(!req.body.title || !req.body.size || !req.body.price){
                return res.status(400).send({error: "Invalid parameters. Please provide all the required information."});
            }

            const id = crypto.randomBytes(16).toString('hex');
            let newPizza = new Pizza({
                title: req.body.title,
                size: req.body.size,
                price: req.body.price,
                image: uploadedfile.filename,
                uniqueId: id
            });

            newPizza.save().then((result) => {
                return res.status(200).json({
                    message: 'Pizza added successfully!',
                    pizza: newPizza
                });
            }).catch((error) => {
                return res.status(501).json({
                    message: 'Something went wrong'
                })
            })
        },

        getAllPizza(req, res) {
            console.log('admin get all pizza');
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

        updatePizza(req, res) {

            Pizza.findOne({uniqueId: req.params.id}, function(err, pizza) {
               
                if(!pizza){
                    return res.status(404).json({
                        message: 'Data not found'
                    })
                }else{
                    try{
                        if(req.body.title){
                            pizza.title = req.body.title
                        }
                        if(req.body.size){
                            pizza.size = req.body.size
                        }
                        if(req.body.price){
                            pizza.price = req.body.price
                        }
                        if(uploadedfile){
                            console.log('uploadfile')
                            fs.unlink(`./resources/images/app/${pizza.image}`, function(err){
                                if(err){
                                    return res.status(500).json({
                                        message: 'Error updating pizza image'
                                    });
                                }
                            });
                            pizza.image = uploadedfile.filename
                        }
                        pizza.save(() => {
                            return res.status(200).json({
                                message: 'Pizza updated successfully'
                            }); 
                            });
                     } catch(error){
                         return res.status(500).json({
                             message: 'Something went wrong while updating pizza'
                         });
                     }
                }
            })
        },

        deletePizza(req, res){
            Pizza.deleteOne({uniqueId: req.params.id}, function(err){
                if(err){
                    return res.status(500).json({
                        message: 'Error in deleting pizza'
                    })
                }

                return res.status(200).json({
                    message: 'Pizza deleted successfully!'
                })
            })
        }
    }
}

module.exports = pizzaController;