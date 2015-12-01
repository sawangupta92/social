var mongoose = require('mongoose');
var User = mongoose.model('users', { fullname: String, password: String });

module.exports = User;
