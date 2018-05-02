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
    levelUpPoints: {
        type: Number,
        required: true,
        default: 0
    },
    baseConstitution: {
        type: Number,
        required: true,
        default: 1
    },
    baseStrength: {
        type: Number,
        required: true,
        default: 1
    },
    baseDexterity: {
        type: Number,
        required: true,
        default: 1
    },
    baseIntelligence: {
        type: Number,
        required: true,
        default: 1
    },
    bonusConstitution: {
        type: Number,
        required: true,
        default: 0
    },
    bonusStrength: {
        type: Number,
        required: true,
        default: 0
    },
    bonusDexterity: {
        type: Number,
        required: true,
        default: 0
    },
    bonusIntelligence: {
        type: Number,
        required: true,
        default: 0
    },
    gold: {
        type: Number,
        required: true,
        default: 0
    },
    experience: {
        type: Number,
        required: true,
        default: 0
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