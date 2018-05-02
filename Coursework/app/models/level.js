var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// inventory schema
var LevelSchema = new Schema({
	
	level: {
		type: Number,
		required: true,
		index: {
			unique: true
		}
	},
	experience: {
		type: Number,
		required: true
	}

});

module.exports = mongoose.model('Level', LevelSchema);