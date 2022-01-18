var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    uniqueId: {
        type: String,
        required: true
    }
},{timestamps: true});

module.exports.Pizza = mongoose.model('Pizza', PizzaSchema);