var express = require('express');
var router = express.Router();
// var FB = require('fb');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  if(false){
    FB.setAccessToken(req.user.password);
    FB.options({scope: ['user_posts', 'public_profile', 'publish_actions']});
    var msg = 'looks good';
    FB.api('me/feed', 'post', { message: msg}, function (res) {
      if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('Post Id: ' + res.id);
    });
  };
  res.render('index', { title: 'Express', user: req.user });
});

module.exports = router;
