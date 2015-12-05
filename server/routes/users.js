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
  User.find(function(err, user) {
    if(err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.render('user/index', {
        title: 'UserPage',
        user : user,
        displayName: req.user ? req.user.displayName : '',
        username: req.user ? req.user.username : ''
      });
    }
  });
});

router.get('/:id', requireAuth, function(req, res, next){
  //create the id variable
  var id = req.params.id;
  
  // use mongoose nad model to find the contact
  User.findById(id, function(err, user) {
    
      
    if(err) {
      console.log(err);
      res.end(err);
    }
    else {
      //show edit view
      res.render('user/editUser', {
        title: "Edit",
        user: user,
        displayName: req.user ? req.user.displayName : '',
        username: req.user ? req.user.username : ''
        
        
      });
    }
    });
  });


/* Edit form submission */

router.post('/:id', requireAuth, function(req, res, next) {
  var id = req.params.id;
  var user = new User(req.body);
  user._id = id;
  user.updated = Date.now();
  
  // mongoose will do the update
  User.update({_id: id}, user, function (err) {
    if(err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/user');
    }
  });
});

module.exports = router;
