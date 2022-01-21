const User = require('../../../models/user').User;

function ownerController() {
    return{
        getAllOwners(req, res) {
            let query = User.find({role: 'admin'}).select({'email': 0, 'uniqueId': 0, 'contact': 0, 'password': 0, 'role': 0, 'createdAt': 0, 'updatedAt': 0, '__v': 0});
            query.exec(function(err, user){
                console.log('user', user);
                
                if(err){
                    return res. status(500).json({
                        message: 'Something went wrong'
                    })
                }

                if(!user){
                    return res.status(404).json({
                        message: 'Data not found'
                    })
                }
               
                return res.send(user)
            })
        }
    }
}

module.exports = ownerController;