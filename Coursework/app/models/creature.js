var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// item schema
var CreatureSchema = new Schema({
	name: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	description: {
		type: String,
		required: true
	},
	constitution: {
		type: Number,
		required: true
	},
	strength: {
		type: Number,
		required: true
	},
	dexterity: {
		type: Number,
		required: true
	},
	intelligence: {
		type: Number,
		required: true
	},
	growth: {
		type: Number,
		required: true
	},
	difficulty: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Creature', CreatureSchema);