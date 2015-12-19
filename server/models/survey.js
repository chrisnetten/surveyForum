var mongoose = require('mongoose');

var SurveySchema = new mongoose.Schema ( {
	name: String,
	username: String,
	note: String,
	question: String,
	updated: {type: Date, default: Date.now},
	description: String,
	answer: [{
		trueFalse: String,
		shortAnswer: String,
		email: String
		}]
	
},
{
	collection: 'survey'
});

module.exports = mongoose.model('Survey', SurveySchema);