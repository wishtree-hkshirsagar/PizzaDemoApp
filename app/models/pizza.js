var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var PizzaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    size: {
        type: String,
    },
    price: {
        type: Number,
    },
    image: {
        type: String,
    },
    ownerId: {
        type: ObjectId,
        ref: 'User',
        require: true
    },
    uniqueId: {
        type: String,
        required: true
    }
},{timestamps: true});

module.exports.Pizza = mongoose.model('Pizza', PizzaSchema);