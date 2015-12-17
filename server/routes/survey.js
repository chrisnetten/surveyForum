var express = require('express');
var router = express.Router();

//var mongoose = require('mongoose');
var Survey = require('../models/survey.js');




/* CREATE Surveys */
router.post('/',  function(req, res, next){
   Survey.create(req.body, function(err, post){
      if(err){
        return next(err);}

      res.json(post);
   });
});

/* READ Surveys */
router.get('/',  function(req, res, next) {
  Survey.find(function(err,survey){
     if(err){return next(err);}
      res.json(survey);
  });
});

/* READ /survey/id */
router.get('/:id', function(req,res, next) {
   Survey.findById(req.params.id, function(err,post){
      if(err) {
        return next(err);}
       res.json(post);
   });
});

/* UPDATE /survey/:id */
router.put('/:id',  function(req,res, next){
   Survey.findByIdAndUpdate(req.params.id, req.body, function(err, post){
      if(err) {return next(err);}
       res.json(post);
   }); 
});

/* DELETE /survey/:id */
router.delete('/:id', function(req,res,next){
   Survey.findByIdAndRemove(req.params.id, req.body, function(err,post){
      if(err) {return next(err);}
       res.json(post);
   });
});


module.exports = router;