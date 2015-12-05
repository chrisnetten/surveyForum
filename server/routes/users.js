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
      res.render('users/index', {
        title: 'UserPage',
        users : users,
        displayName: req.user ? req.user.displayName : '',
        username: req.user ? req.user.username : '',
        email: req.user? req.user.email : '',
        created: req.user? req.user.created : '',
        _id: req.user? req.user._id : ''
      });
    }
  });
});


router.get('/:id', requireAuth, function(req, res, next){
  //create the id variable
  var id = req.params.id;
  
  // use mongoose nad model to find the contact
  User.findById(id, function(err, users) {
    
      
    if(err) {
      console.log(err);
      res.end(err);
    }
    else {
      //show edit view
      res.render('users/editUser', {
        title: "EditUser",
        users: users,
        displayName: req.user ? req.user.displayName : '',
        username: req.user ? req.user.username : ''
        
        
      });
    }
    });
  });


/* Edit form submission */

router.post('/:id', requireAuth, function(req, res, next) {
  var id = req.params.id;
  var users = new User(req.body);
  users._id = id;
  users.updated = Date.now();
  
  // mongoose will do the update
  User.update({_id: id}, users, function (err) {
    if(err) {
      console.log(err);
      res.end(err);
    }
    else {
      res.redirect('/users');
    }
  });
});

module.exports = router;
