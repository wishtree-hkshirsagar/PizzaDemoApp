var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var OrderSchema = new Schema({
    customerId: {
        type: ObjectId,
        ref: 'User',
        require: true
    },
    outletId: {
        type: ObjectId,
        ref: 'Outlet',
        require: true
    },
    items: {
        type: Object,
        require: true
    },
    contactNumber: {
        type: String,
        require: true
    },
    address: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        default: 'COD'
    },
    paymentStatus: { 
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'order_placed'
    },
    uniqueId: {
        type: String,
        required: true
    }
},{timestamps: true});

module.exports.Order = mongoose.model('Order', OrderSchema);