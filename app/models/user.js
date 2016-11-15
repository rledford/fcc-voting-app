var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

var User = new Schema({
   firstName: String,
   lastName: String,
   email: String,
   username: String,
   password: String,
   pollsOwned: [String],
   voteHistory: [String]
});

User.methods.authenticate = function(password){
   console.log('authenticating user');
   return this.password === password;
};



//the first param 'User' is how this model is accessed
//through mongoose
module.exports = mongoose.model('User', User, 'users');
