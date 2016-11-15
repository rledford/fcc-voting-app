var users = require('../../app/controllers/users.server.controller.js');

module.exports = function(app, passport){
   app.route('/signin')
      .get(users.renderSignin)
      .post(passport.authenticate('local', {
         successRedirect: '/profile',
         failureRedirect: '/signin',
         failureFlash: true
      }));

   app.route('/signup')
      .get(users.renderSignup);

   app.route('/profile')
      .get(users.mapPollIdToTitle, users.renderProfile);

   app.route('/:userId/create-poll')
      .get(users.renderCreatePoll)
      .post(users.createPoll);

   app.route('/delete-poll')
      .post(users.deletePoll);

   app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
   });

   app.param('userId', users.readUserId);
};
