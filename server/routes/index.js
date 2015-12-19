var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/user');
var Survey = require('../models/survey');


function requireAuth(req,res,next) {
   
   //is user logged in
   if(!req.isAuthenticated()){
   return res.redirect('/login');
}
next();
}

/* GET home page. */

 
 router.get('/',  function (req, res, next) {
  Survey.find(function(err, survey) {
    
    if(err) {
      console.log(err);
      res.end(err);
    }
    else{
      res.render('index', {
          title: 'Survey',
          survey: survey,
          displayName: req.user ? req.user.displayName : '',
           username: req.user ? req.user.username : ''
          
      });
    }
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
});

router.get('/add', requireAuth, function(req, res, next) {
  res.render('add', {
    title: 'AddSurvey', 
    displayName: req.user ? req.user.displayName : '',
    username: req.user ? req.user.username : ''
  })
});
/* Submisson of new user */

router.post('/add', requireAuth, function (req, res, next) {
    var survey = new Survey(req.body);
    
    
    Survey.create({
      name: req.body.name,
      username: req.body.username,
      Question: req.body.question,
      created: Date.now(),
      updated: Date.now()
    }, function(err, User) {
      if(err) {
        console.log(err);
        res.end(err);
      }
      else {
        res.redirect('/')
      }
    });
});

router.get('/userSurvey', requireAuth, function(req, res, next) {
  User.find(function(err, users) {
     Survey.find(function(err, survey) {
    if(err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.render('userSurvey', {
        title: 'UserSurvey',
        users : users,
        survey: survey,
        displayName: req.user ? req.user.displayName : '',
        username: req.user ? req.user.username : '',
        email: req.user? req.user.email : '',
        created: req.user? req.user.created : '',
      });
    }
  });
});
});
module.exports = router;
