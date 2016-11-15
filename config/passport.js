var passport = require('passport'),
   mongoose = require('mongoose');

module.exports = function () {
   var User = mongoose.model('User');

   passport.serializeUser(function(user, done){
      return done(null, user.id);
   });

   passport.deserializeUser(function(id, done){
      //get user by id but do not include its password in the returned doc
      User.findOne({_id: id}, '-password', function(err, user){
         done(err, user);
      });
   });

   require('../app/strategies/local.js')(passport);
};
