var path = process.cwd(),
   pollController = require(path+'/app/controllers/poll.server.controller');

module.exports = function (app, passport) {
   'use strict';
   app.route('/').get( function (req, res) {
      res.render('index.ejs', {user: req.user});
   });

   app.route('/polls').get( pollController.getAllPollsList, function(req, res) {
      //change index html to all-polls.html
      res.render('all-polls.ejs', {user: req.user, allPolls: req.allPolls, message: req.flash('pollMessage')});
   });

   app.route('/api/v1/polls')
      .get(pollController.getPollList);

   app.route('/poll/vote')
      .post(pollController.votePoll);

   app.route('/poll/:pollId').get( function (req, res) {
      //labels and data passed to poll.ejs are empty arrays that will be populated
      //within the ejs for use in the chart
      var bg = "";
      for (var i = 0; i < req.poll.choices.length; i++){
         bg += pollController.randomRGBA();
         if (i < req.poll.choices.length-1){
            bg += ';';
         }
      }
      res.render('poll', {
         message: req.flash('pollMessage'),
         user: req.user,
         poll: req.poll,
         labels: [],
         data: [],
         bg: bg
      });
   });
   app.param('pollId', pollController.getPollById);
};
