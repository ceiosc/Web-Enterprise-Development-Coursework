var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// inventory schema
var InventorySchema = new Schema({
    characterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
        required: true
    },
    itemID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('Inventory', InventorySchema);