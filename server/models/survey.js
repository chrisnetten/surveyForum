var mongoose = require('mongoose');

var SurveySchema = new mongoose.Schema ( {
	name: String,
	completed: Boolean,
	note: String,
	updated: {type: Date, default: Date.now}
	
},
{
	collection: 'survey'
});

module.exports = mongoose.model('Survey', SurveySchema);