var mongoose = require('mongoose');
var findOneOrCreate = require('mongoose-find-one-or-create');
var UserSchema = mongoose.Schema({ social_id: String, fullname: String, password: String, access_token_key: String, access_token_secret: String, oauth_verifier: String });
UserSchema.plugin(findOneOrCreate);
User = mongoose.model('users', UserSchema);

module.exports = User;
