var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// spell schema
var SpellSchema = new Schema({
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
    cost: {
        type: Number,
        required: false
    },
    level: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: true
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
    damage: {
        type: Number,
        required: false
    },
    health: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('Spell', SpellSchema);