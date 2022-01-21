var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var OutletSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    ownerId: {
        type: ObjectId,
        ref: 'User',
        require: true
    },
    ownerName: {
        type: String,
        required: true
    },
    uniqueId: {
        type: String,
        required: true
    },
    outletStatus: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

module.exports.Outlet = mongoose.model('Outlet', OutletSchema);