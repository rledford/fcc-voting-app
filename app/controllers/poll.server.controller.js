var Poll = require('../models/poll'),
   User = require('../models/user'),
   querystring = require('querystring');

exports.getPollById = function (req, res, next, pollId) {
   //get the poll from the database that matches the id
   //once fetched, convert to JSON and place the object inside the
   //request as req.poll = obj

   Poll.findById(pollId, function (err, item){
      console.log('finding poll by id');
      if (err){
         console.log(err);
         res.send(err);
      } else {
         if (item){
            console.log(item);
            req.poll = item;
         } else {
            console.log('no poll id match found');
         }
         next();
      }
   });
};

exports.votePoll = function (req, res) {
   var pollURL = '/poll/'+req.body.pollId;
   if (!req.user){
      console.log('no user');
      req.flash('pollMessage', 'Please sign in to vote.');
      res.redirect(pollURL);
   } else {
      if (req.body.voteIndex === req.body.customVoteIndex){
         if (req.body.customVote !== ""){
            Poll.update({'_id': req.body.pollId}, {$push: {"choices": {"choice": req.body.customVote, "votes": 1}}}, function(err, raw){
               if (err) {
                  console.log(err);
               }
               res.redirect(pollURL);
               //res.redirect(pollURL);
            });
         } else {
            res.redirect(pollURL);
            //res.redirect(pollURL);
         }
      }
      else{
         //create custom incrementer based on the index passed by the POST request
         //since this can't be done in-line for the update method
         //similar solution found at: http://stackoverflow.com/questions/38158140/update-array-in-mongodb-document-by-variable-index
         var inc = {"$inc": {}};
         inc["$inc"]["choices."+req.body.voteIndex+".votes"] = 1;
         Poll.update({'_id': req.body.pollId}, inc, function(err, raw){
            if (err) {
               console.log(err);
            }
            res.redirect('/poll/'+req.body.pollId);
         });
      }
   }
};

exports.getAllPollsList = function (req, res, next){
   Poll.find({}, function(err, polls){
      if (err){
         req.flash('pollMessage', 'Database error');
         return next();
      }
      req.allPolls = polls;
      next();
   });
};

exports.updatePoll = function (req, res) {
   //should be called on POST
   var poll = new Poll(req.body);
};

exports.randomRGBA = function () {
   var color =  {
      r: Math.floor(Math.random()*256),
      g: Math.floor(Math.random()*256),
      b: Math.floor(Math.random()*256),
      a: 0.7
   };

   return 'rgba('+color.r+','+color.g+','+color.b+','+color.a+')';
};
