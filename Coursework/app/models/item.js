var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// item schema
var ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    slot: {
        type: String,
        required: false
    },
    constitution: {
        type: Number,
        required: false
    },
    strength: {
        type: Number,
        required: false
    },
    dexterity: {
        type: Number,
        required: false
    },
    intelligence: {
        type: Number,
        required: false
    },
    health: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('Item', ItemSchema);