var LocalStrategy = require('passport-local').Strategy,
   User = require('mongoose').model('User');

module.exports = function (passport) {
   console.log('local strategy loaded');
   passport.use('local', new LocalStrategy( { usernameField: 'username', passwordField: 'password', passReqToCallback: true},
   function (req, username, password, done){
      console.log('processing authentication request');
      User.findOne({ username: username }, function (err, user) {
         if (err) {
            return done(err);
         }
         if (!user) {
            return done(null, false, req.flash('signinMessage', 'Username does not exist.'));
         }
         if (!user.authenticate(password)){
            return done(null, false, req.flash('signinMessage', 'Incorrect password.'));
         }

         return done(null, user);
         });
   }));
};
