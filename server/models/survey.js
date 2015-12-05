//Import mongoose and bcrypt

var mongoose = require('mongoose');



// Define user Schema

var SurveySchema = new mongoose.Schema ( {
	
	username: String,
	name: String,
	question: String,
	choice: String,
	response: String,
	replies: Number,
	created: Number,
	updated: Number,
	expirationDate: Number
	
	
},
{
	collection: 'survey'
});



module.exports = mongoose.model('Survey', SurveySchema);