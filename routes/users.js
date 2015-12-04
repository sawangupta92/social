var express = require('express');
var router = express.Router();
User = require('./../models/users.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('users/login');
});

router.get('/new', function(req, res, next) {
  res.render('users/new');
});

router.post('/create', function(req, res, next) {
  user = User.create({'fullname': req.body.username, 'password': req.body.password}, function(err, user){
    if(err){
      res.render('users/new');
    } else{
      res.redirect('/');
    }
  });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

module.exports = router;
