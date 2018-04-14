var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// quest schema
var QuestSchema = new Schema({
    questID: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    characterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
        required: true
    },
    completionStatus: {
        type: Number,
        required: true
    },
    rewardXP: {
        type: Number,
        required: false
    },
    rewardItem1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    rewardItem2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    rewardItem3: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }

});

module.exports = mongoose.model('Quest', QuestSchema);