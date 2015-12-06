var express = require('express');
var router = express.Router();
// var Twitter = require('twitter');
// var FB = require('fb');
var Twitter = require('node-twitter-api');

/* GET home page. */
router.get('/', function(req, res, next) {
  var twitter = new Twitter({
    consumerKey: 'mPuf4oGLAhPgV0Cqn2r1K8loa',
    consumerSecret: '19k6VOHrmsXdaLV1FlWEZIe3EizKUVWsiKwkKSkYBHw06eZdFZ',
    callback: "http://5dd40269.ngrok.com/twit-login/callback"
  });
  twitter.getTimeline("user_timeline", {
        screen_name: req.user.fullname
      },
      req.user.access_token_key,
      req.user.access_token_secret,
      function(error, data) {
          if (error) {
          } else {
            
          }
      }
  );
  console.log(req.session)
  req.session.hiq = 'this is good'
  // var twitter = new Twitter({
  //   consumer_key: 'mPuf4oGLAhPgV0Cqn2r1K8loa',
  //   consumer_secret: '19k6VOHrmsXdaLV1FlWEZIe3EizKUVWsiKwkKSkYBHw06eZdFZ'
  // });

  // client.get('statuses/user_timeline', { screen_name: user.fullname }, function(error, tweets, response){
  //   console.log(error);
  //   if (!error) {
  //     console.log(tweets);
  //   }
  // });

  // console.log(req.user);
  // if(false){
  //   FB.setAccessToken(req.user.password);
  //   FB.options({scope: ['user_posts', 'public_profile', 'publish_actions']});
  //   var msg = 'looks good';
  //   FB.api('me/feed', 'post', { message: msg}, function (res) {
  //     if(!res || res.error) {
  //       console.log(!res ? 'error occurred' : res.error);
  //       return;
  //     }
  //     console.log('Post Id: ' + res.id);
  //   });
  // };
  res.render('index', { title: 'Express', user: req.user });
});

module.exports = router;
