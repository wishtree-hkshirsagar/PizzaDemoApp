var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'customer'],
        default: 'customer'
    },
    uniqueId: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports.User = mongoose.model('User', UserSchema);