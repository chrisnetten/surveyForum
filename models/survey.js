//Import mongoose and bcrypt

var mongoose = require('mongoose');



// Define user Schema

var SurveySchema = new mongoose.Schema ( {
	
	username: String,
	surveyname: String,
	question: String,
	choice: String,
	response: String
	
	
},
{
	collection: 'survey'
});



module.exports = mongoose.model('Survey', SurveySchema);