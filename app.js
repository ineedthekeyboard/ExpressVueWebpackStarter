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

var index = require('./backend/routes/index');
var users = require('./backend/routes/users');
var register = require('./backend/routes/register');
var login = require('./backend/routes/login');

var app = express();
var isDevelopment = process.env.NODE_ENV !== "production";

// view engine setup
app.set('views', path.join(__dirname, 'frontend/views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  // cookie: { secure: true } for ssl?
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(cookieParser());

//Local login strategy:
passport.use(new LocalStrategy(
  function(username, password, done) {
    var userExists, user, users = require('./backend/localDB')['users'];
    if (!username) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    userExists = (users.filter(function(user){
      return user.email === username;
    }).length > 0);


    if (userExists) {
      user = users.filter(function(user){
        return user.email === username;
      })[0];
      //Verify username and pass
      if (user.email === username && user.password === password) {
        return done(null, user);
      } else { //Failed verification check
        return done(null, false, { message: 'Incorrect username or password.' });
      }
    } else { //User does not exist: failed
      return done(null, false, { message: 'User does not exist.' });
    }

  }
));

//These functions are pure passthroughs for now.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(userId, done) {
  var users = require('./backend/localDB')['users'];
  var user = users.filter(function(user){
        return user.id === userId;
      })[0] || {};
  done(null, user);
});

//IF DEV:
if (isDevelopment) {
  var webpack = require('webpack');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpackConfig = require('./webpack.dev.config.js');
  console.log('Webpack middleware is running: Dev mode is on.');
  app.use(webpackDevMiddleware(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(webpack(webpackConfig)));
}


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);

//Testing Purposes Long Running Processes
app.get('/cpu', cpuBound);
app.get('/memory', memoryBound);
app.get('/io', ioBound);
function cpuBound(req, res, next) {
  const key = Math.random() < 0.5 ? 'ninjaturtles' : 'powerrangers';
  const hmac = crypto.createHmac('sha512WithRSAEncryption', key);
  const date = Date.now() + '';
  hmac.setEncoding('base64');
  hmac.end(date, () => res.send('A hashed date for you! ' + hmac.read()));
}

function memoryBound(req, res, next) {
  const hundredk = new Array(100 * 1024).join('X');
  setTimeout(function sendResponse() {
    res.send('Large response: ' + hundredk);
  }, 20).unref();
}

function ioBound(req, res, next) {
  setTimeout(function SimulateDb() {
    res.send('Got response from fake db!');
  }, 300).unref();
}
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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
