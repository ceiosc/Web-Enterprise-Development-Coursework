var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// quest schema
var shopSchema = new Schema({
    shopOwner: {
        type: String,
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Shop', shopSchema);