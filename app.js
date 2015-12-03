var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require('./routes/index');
var objectId = mongoose.Types.ObjectId;
var users = require('./routes/users');
var session = require('express-session');
var app = express();
var db = require('./db/users');
var MongoStore = require('connect-mongo')(session);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

mongoose.connect('mongodb://localhost/social');
app.use(session({
    secret: 'sawan',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false
}));
user = require('./models/users.js')
var authenticateUser = require('./modules/authenticate_user.js')(app, db, user, objectId)
// (new authenticateUser(app))

app.set('view engine', 'jade');

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


// module.exports = app;
app.listen(2000);
