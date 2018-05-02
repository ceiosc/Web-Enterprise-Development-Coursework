var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// quest schema
var npcSchema = new Schema({    
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    shopOwner: {
        type: Boolean,
        required: true
    },
    shopName: {
        type: String,
        required: false
    },
    questGiver: {
        type: Boolean,
        required: false
    },
    welcome: {
        type: String,
        required: true
    },
    thank: {
        type: String,
        required: true
    },
    farewell: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Npc', npcSchema);