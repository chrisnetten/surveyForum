var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/user');

/* Function to check if user is authenticated */
function requireAuth(req, res, next) {
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
 next(); 
}

/* GET users listing. */
router.get('/', requireAuth, function(req, res, next) {
  User.find(function(err, users) {
    if(err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.render('user/index', {
        title: 'UserPage',
        users : users,
        displayName: req.user ? req.user.displayName : ''
      });
    }
  });
});

module.exports = router;
