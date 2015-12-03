var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  displayName: req.user ? req.user.displayName : ''
  })
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
      message: req.flash('registerMessage'),
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

module.exports = router;
