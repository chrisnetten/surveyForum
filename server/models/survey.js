var mongoose = require('mongoose');

var SurveySchema = new mongoose.Schema ( {
	name: String,
	completed: Boolean,
	username: String,
	note: String,
	question: String,
	updated: {type: Date, default: Date.now},
	answer: []
	
},
{
	collection: 'survey'
});

module.exports = mongoose.model('Survey', SurveySchema);