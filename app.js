var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var debug = require('debug')('sampleexpress:server');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var authentication = require('./backend/authentication');

//Routers
var users = require('./backend/routes/users');
var register = require('./backend/routes/register');
var login = require('./backend/routes/login');

var app = express();
var isDevelopment = process.env.NODE_ENV !== "production";

// view engine setup
// app.set('views', path.join(__dirname, 'frontend/views'));
// app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Setup Sessions for passport to bolt onto
app.use(flash());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  // cookie: { secure: true } for ssl only - enable for production
}));
//Bolt passport sessions to express sessions
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());

//Setup Passport authentication
passport.use(new LocalStrategy(authentication.basicAuthStrategey));
passport.serializeUser(authentication.serializeSession);
passport.deserializeUser(authentication.deSerializeSession);

// Application Routes
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', index);
// app.use('/users', users);
// app.use('/login', login);
// app.use('/register', register);

//********* 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

module.exports = app;
