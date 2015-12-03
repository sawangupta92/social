var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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

    passport.use(new FacebookStrategy({
        clientID: '1093479127338443',
        clientSecret: '22e6ff164635f4155a105ed3dd89ef52',
        callbackURL: "http://localhost:2000/fb-login/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOneOrCreate(
          { 'social_id': profile.id },
          { 'social_id': profile.id, 'fullname': profile.displayName, 'password': accessToken }, function(err, user) {
            if (err) { return done(err) }
            done(null, user)
          }
        )
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
  }

  this.authenticateLoginRequestUsingFacebook = function(){
    app.get('/fb-login', passport.authenticate('facebook'));
  };

  this.authenticateLoginRequestUsingFacebookCallback = function(){
    app.get('/fb-login/callback', 
    passport.authenticate('facebook', { failureRedirect: '/users/login' }),
    function(req, res) {
      res.redirect('/');
    });
  };

  this.initializePassport();
  this.authenticateLoginRequest();
  this.authenticateLoginRequestUsingFacebook();
  this.authenticateLoginRequestUsingFacebookCallback();

};

module.exports = authenticateUser;
