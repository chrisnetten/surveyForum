var mongoose = require('mongoose');

var SurveySchema = new mongoose.Schema ( {
	name: String,
	username: String,
	
	updated: {type: Date, default: Date.now}
	
},
{
	collection: 'survey'
});

module.exports = mongoose.model('Survey', SurveySchema);