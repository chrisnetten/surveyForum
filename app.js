var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Route Alias
var routes = require('./routes/index');
var users = require('./routes/users');

//Authentication/DB Modules
var session = require('express-session'); //Session
var mongoose = require('mongoose'); //DB
var flash = require('connect-flash'); //Flash Messages
var passport = require('passport'); // Authentication

//DB SetUP
var DB = require('./config/db.js');
mongoose.connect(DB.url);
mongoose.connection.on('error', function() {
  
  console.error('MongoDB Connection Failed..');
});

// passport config
require('./config/passport')(passport)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session setup * think to place this in seperate config file along with other sessions*
app.use(session({
  secret: 'someSecret',
  saveUninitialized: true,
  resave: true
}));

//PART 2 : passport and flash config
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
