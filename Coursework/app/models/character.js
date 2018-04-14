var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// character schema
var CharacterSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: {
            unique: true
        }
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    constitution: {
        type: Number,
        required: true,
        default: 1
    },
    strength: {
        type: Number,
        required: true,
        default: 1
    },
    dexterity: {
        type: Number,
        required: true,
        default: 1
    },
    intelligence: {
        type: Number,
        required: true,
        default: 1
    },
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Item',
        required: false
    },
    chest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: false
    },
    legs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: false
    },
    boots: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: false
    },
    mainhand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: false
    },
    offhand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: false
    },
    ring: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: false
    },
    amulet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: false
    }
});

module.exports = mongoose.model('Character', CharacterSchema);