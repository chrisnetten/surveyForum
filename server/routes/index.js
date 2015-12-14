var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/user');

var PollSchema = require('../models/Poll.js').PollSchema;
var Poll = db.model('polls', PollSchema);
/* GET home page. */
router.get('/', function(req, res, next) {
  

      res.render('index', {  
      displayName: req.user ? req.user.displayName : '',
      username: req.user ? req.user.username : ''
      
      });
});
    


router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Home', 
     messages: req.flash('loginMessage'),
    displayName: req.user ? req.user.displayName : ''
  })
});

router.post('/login', passport.authenticate('loginLocal', {
  successRedirect: '/users',
  failerRedirect: '/login',
  failureFlash: true
}))

/* Show Registration Page */
router.get('/register', function(req, res, next) {
  if(!req.user) {
    res.render('register', {
      title: 'Register',
      message: req.flash('registrationMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
  }
  else {
    return res.redirect('/');
  }
});

/* Registration Post Request */

router.post('/register', passport.authenticate('localRegistration', {
  successRedirect: '/users',
  failureRedirect: '/register',
  failerFlash: true
}))

/* Logout Request */

router.get('/logout', function(req,res) {
  req.logout();
  res.redirect('/');
})



/* poll */

exports.list = function(req, res) {
	// Query Mongo for polls, just get back the question text
	Poll.find({}, 'question', function(error, polls) {
		res.json(polls);
	});
};

// JSON API for getting a single poll
exports.poll = function(req, res) {
	// Poll ID comes in the URL
	var pollId = req.params.id;
	
	// Find the poll by its ID, use lean as we won't be changing it
	Poll.findById(pollId, '', { lean: true }, function(err, poll) {
		if(poll) {
			var userVoted = false,
					userChoice,
					totalVotes = 0;

			// Loop through poll choices to determine if user has voted
			// on this poll, and if so, what they selected
			for(c in poll.choices) {
				var choice = poll.choices[c]; 

				for(v in choice.votes) {
					var vote = choice.votes[v];
					totalVotes++;

					if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
						userVoted = true;
						userChoice = { _id: choice._id, text: choice.text };
					}
				}
			}

			// Attach info about user's past voting on this poll
			poll.userVoted = userVoted;
			poll.userChoice = userChoice;

			poll.totalVotes = totalVotes;
		
			res.json(poll);
		} else {
			res.json({error:true});
		}
	});
};

// JSON API for creating a new poll
exports.create = function(req, res) {
	var reqBody = req.body,
			// Filter out choices with empty text
			choices = reqBody.choices.filter(function(v) { return v.text != ''; }),
			// Build up poll object to save
			pollObj = {question: reqBody.question, choices: choices};
				
	// Create poll model from built up poll object
	var poll = new Poll(pollObj);
	
	// Save poll to DB
	poll.save(function(err, doc) {
		if(err || !doc) {
			throw 'Error';
		} else {
			res.json(doc);
		}		
	});
};

exports.vote = function(socket) {
	socket.on('send:vote', function(data) {
		var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
		
		Poll.findById(data.poll_id, function(err, poll) {
			var choice = poll.choices.id(data.choice);
			choice.votes.push({ ip: ip });
			
			poll.save(function(err, doc) {
				var theDoc = { 
					question: doc.question, _id: doc._id, choices: doc.choices, 
					userVoted: false, totalVotes: 0 
				};

				// Loop through poll choices to determine if user has voted
				// on this poll, and if so, what they selected
				for(var i = 0, ln = doc.choices.length; i < ln; i++) {
					var choice = doc.choices[i]; 

					for(var j = 0, jLn = choice.votes.length; j < jLn; j++) {
						var vote = choice.votes[j];
						theDoc.totalVotes++;
						theDoc.ip = ip;

						if(vote.ip === ip) {
							theDoc.userVoted = true;
							theDoc.userChoice = { _id: choice._id, text: choice.text };
						}
					}
				}
				
				socket.emit('myvote', theDoc);
				socket.broadcast.emit('vote', theDoc);
			});			
		});
	});
};





module.exports = router;
