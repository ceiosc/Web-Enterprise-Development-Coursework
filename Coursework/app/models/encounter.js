var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// item schema
var EncounterSchema = new Schema({
	firstCreature: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creature',
		required: true
    },
    secondCreature: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creature',
        required: false
    },
    thirdCreature: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creature',
        required: false
    },
	experience: {
		type: Number,
		required: true
	},
	minimumLevel: {
		type: Number,
		required: true
	},
	maximumLevel: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('Encounter', EncounterSchema);