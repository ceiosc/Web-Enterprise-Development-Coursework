var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// inventory schema
var EndLeaderSchema = new Schema({
	characterID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Character',
		required: true
	},
	players: {
		type: Number,
		required: true
	},
	score: {
		type: Number,
		required: true
	}

});

module.exports = mongoose.model('EndLeader', EndLeaderSchema);