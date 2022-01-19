const mongoose = require('mongoose');
const properties = require('../config/properties');
const connectDb = () => {
    try{
        const url = properties.MONGODB_URL;
        mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const connection = mongoose.connection
        connection.on('open', () => {
            console.log(`Database connected...`);
        })
    }catch(error) {
        console.log(`error: ${error.message}`);
    }
    
};


module.exports = connectDb;