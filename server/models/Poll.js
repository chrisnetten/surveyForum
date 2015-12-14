var mongoose = require('mongoose');

// Subdocument schema for votes
var voteSchema = new mongoose.Schema({ ip: 'String' },
{
	collection: 'poll'
});

// Subdocument schema for poll choices
var choiceSchema = new mongoose.Schema({ 
	text: String,
	votes: [voteSchema]
},
{
	collection: 'poll'
});

// Document schema for polls
 var PollSchema = new mongoose.Schema({
	question: { type: String, required: true },
	choices: [choiceSchema]
},
{
	collection: 'poll'
});

module.exports = mongoose.model('Poll', voteSchema, choiceSchema, PollSchema);