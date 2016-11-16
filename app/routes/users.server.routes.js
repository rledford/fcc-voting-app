var users = require('../../app/controllers/users.server.controller.js');

module.exports = function(app, passport){
   app.route('/signin')
      .get(users.renderSignin)
      .post(passport.authenticate('local', {
         successRedirect: '/goto-profile',
         failureRedirect: '/signin',
         failureFlash: true
      }));

   app.route('/signup')
      .get(users.renderSignup)
      .post(users.createUser, users.renderProfile);

   app.route('/:userId/profile')
      .get(users.mapPollIdToTitle, users.renderProfile);

   app.get('/goto-profile', function(req, res){
      if (!req.user){
         req.flash('signinMessage', 'Please sign in to view your profile.');
         res.redirect('/signin');
      } else {
         res.redirect('/'+req.user.username+'/profile');
      }
   });

   app.route('/:username/create-poll')
      .get(users.renderCreatePoll)
      .post(users.createPoll);

   app.route('/:username/delete-poll')
      .post(users.deletePoll);

   app.route('/delete-poll')
      .post(users.deletePoll);

   app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
   });

   app.param('username', users.readUsername);
};
