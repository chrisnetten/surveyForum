var express = require('express');
var passport = require('passport');
var router = express.Router();

//var mongoose = require('mongoose');
var Survey = require('../models/survey.js');

/* Utility function to check if user is authenticatd */
function requireAuth(req, res, next){

  // check if the user is logged in
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  next();
}


/* CREATE TODOS */
router.post('/', requireAuth, function(req, res, next){
   Survey.create(req.body, function(err, post){
      if(err){
        return next(err);}

      res.json(post);
   });
});

/* READ TODOS */
router.get('/',  function(req, res, next) {
  Survey.find(function(err,survey){
     if(err){return next(err);}
      res.json(survey);
  });
});

/* READ /todos/id */
router.get('/:id',  function(req,res, next) {
   Survey.findById(req.params.id, function(err,post){
      if(err) {
        return next(err);}
       res.json(post);
   });
});

/* UPDATE /todos/:id */
router.put('/:id', requireAuth, function(req,res, next){
   Survey.findByIdAndUpdate(req.params.id, req.body, function(err, post){
      if(err) {return next(err);}
       res.json(post);
   }); 
});

/* DELETE /todos/:id */
router.delete('/:id', requireAuth, function(req,res,next){
   Survey.findByIdAndRemove(req.params.id, req.body, function(err,post){
      if(err) {return next(err);}
       res.json(post);
   });
});


module.exports = router;