var mongoose = require('mongoose');

var SurveySchema = new mongoose.Schema ( {
	name: String,
	username: String,
	Question: String,
	updated: {type: Date, default: Date.now},
	created: {type: Date, default: Date.now}
	
},
{
	collection: 'survey'
});

module.exports = mongoose.model('Survey', SurveySchema);