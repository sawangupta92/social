var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var authenticateUser = function(app, db, User, objectId){

  this.initializePassport = function() {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new Strategy(
      function(username, password, cb) {
        User.findOne({fullname: username}, function(err, user) {
          if (err) { return cb(err); }
          if (!user) { return cb(null, false); }
          if (user.password != password) { return cb(null, false); }
          return cb(null, user);
        });
      }
    ));

    passport.serializeUser(function(user, cb) {
      cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
      User.findOne({'_id': new objectId(id)}, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
      });
    });
  };

  this.authenticateLoginRequest = function(){
    app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/users/login' }),
    function(req, res) {
      res.redirect('/');
    });
  };

  this.initializePassport();
  this.authenticateLoginRequest();

};

module.exports = authenticateUser;
