var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OtpSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    otp: {
        type: String
    },
    expireIn: {
        type: Number
    },
}, {timestamps: true});

module.exports.Otp = mongoose.model('Otp', OtpSchema, 'otp');