var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var Twitter = require('node-twitter-api');
var authenticateUser = function(app, db, User, objectId){

  this.initializeTwitterAuth = function() {
    var twitter = new Twitter({
      consumerKey: 'mPuf4oGLAhPgV0Cqn2r1K8loa',
      consumerSecret: '19k6VOHrmsXdaLV1FlWEZIe3EizKUVWsiKwkKSkYBHw06eZdFZ',
      callback: "http://45511ec9.ngrok.com/twit-login/callback"
    });
    return twitter;
  }

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

    passport.use(new TwitterStrategy({
        consumerKey: 'mPuf4oGLAhPgV0Cqn2r1K8loa',
        consumerSecret: '19k6VOHrmsXdaLV1FlWEZIe3EizKUVWsiKwkKSkYBHw06eZdFZ',
        callbackURL: "http://45511ec9.ngrok.com/twit-login/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOneOrCreate(
          { 'social_id': profile.id },
          { 'social_id': profile.id, 'fullname': profile.username, 'password': profile.id, 'access_token_key': token, 'access_token_secret': tokenSecret }, function(err, user) {
            if (err) { return done(err) }
            done(null, user)
          }
        )
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
    app.get('/fb-login', passport.authenticate('facebook', { scope: ['user_status', 'user_posts', 'public_profile'] }));
  };

  this.authenticateLoginRequestUsingFacebookCallback = function(){
    app.get('/fb-login/callback', 
    passport.authenticate('facebook', { failureRedirect: '/users/login' }),
    function(req, res) {
      res.redirect('/');
    });
  };

  this.authenticateLoginRequestUsingTwitter = function(){
    app.get('/twit-login', function(req, res){
      var twitter = this.initializeTwitterAuth();
      twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
        if(error){
          res.redirect('/');
        } else{
          req.session.requestToken = requestToken;
          req.session.requestTokenSecret = requestTokenSecret;
          res.redirect(twitter.getAuthUrl(requestToken));
        }
      })
    });
  };

  this.authenticateLoginRequestUsingTwitterCallback = function(){
    app.get('/twit-login/callback',
    function(req, res, done) {
      var twitter = this.initializeTwitterAuth();
      twitter.getAccessToken(req.session.requestToken, req.session.requestTokenSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
        if (error) {
          console.log(error);
        } else {
          User.findOneOrCreate(
            { 'social_id': results.user_id },
            { 'social_id': results.user_id, 'fullname': results.screen_name, 'password': req.session.requestTokenSecret, 'access_token_key': accessToken, 'access_token_secret': accessTokenSecret, 'oauth_verifier': req.query.oauth_verifier }, function(err, user) {
              if(err){
                res.redirect('/')
              } else {
                req.session.passport = { 'user': user._id }
                res.redirect('/')
              }
            }
          )
        }
      });
    });
  };

  this.initializePassport();
  this.authenticateLoginRequest();
  this.authenticateLoginRequestUsingFacebook();
  this.authenticateLoginRequestUsingFacebookCallback();
  this.authenticateLoginRequestUsingTwitter();
  this.authenticateLoginRequestUsingTwitterCallback();

};

module.exports = authenticateUser;
// /twit-login/callback
