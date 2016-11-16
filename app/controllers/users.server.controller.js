var User = require('../models/user'),
   Poll = require('../models/poll');

exports.renderSignin = function(req, res, next){
   if (!req.user){
      //render signin page and pass any flash messages
      res.render('signin', {message: req.flash('signinMessage')});
   } else {
      res.redirect('/');
   }
};

exports.renderSignup = function(req, res){
   res.render('signup', {message: req.flash('signupMessage')});
};

exports.renderPoll = function(req, res){
   res.render('poll', {message: req.flash('pollMessage')});
};

exports.readUsername = function(req, res, next, username){
   req.username = username;
   next();
};

exports.renderCreatePoll = function(req, res){
   if (req.user){
      res.render('create-poll', {user: req.user, message: req.flash('pollMessage')});
   } else {
      res.redirect('/signin');
   }
};

exports.createUser = function(req, res, next){
   //should only be called for post requests
   console.log('processing create user request');
   var fname = req.body.firstName,
      lname = req.body.lastName,
      email = req.body.email,
      username = req.body.username,
      pw = req.body.password,
      pwConfirm = req.body.confirmPassword;

   if (pw !== pwConfirm){
      req.flash('signupMessage', 'The passwords you provided do not match');
      return res.redirect('/signup');
   }
   
   User.findOne({username: username}, function(err, user){
      if(err){
         req.flash('signupMessage', err);
         return res.redirect('/signup');
      }

      if (user !== null){
         req.flash('signupMessage', 'The Username is not available');
         return res.redirect('/signup');
      }

      var newUser = new User();
      newUser.firstName = fname;
      newUser.lastName = lname;
      newUser.email = email;
      newUser.username = username;
      newUser.password = pw;
      newUser.save();
      req.flash('signinMessage', 'Thank you for registering. Please sign in.');
      next();
   });
};

exports.createPoll = function(req, res) {
   if (!req.user){
      req.flash('signinMessage', 'Please sign in to create a poll.');
      res.redirect('/signin');
   }

   var createPollRedirect = '/'+req.user.username+'/create-poll';

   if (req.body.title.replace(/\s/g,'').length === 0){
      req.flash('pollMessage', 'You must provide a title.');
      res.redirect(createPollRedirect);
   }
   else {
      var choices = [], i = 0, choice = 'choice', poll = new Poll();
      while(true){
         //check to make sure the choice exists
         if(req.body[choice+i] !== undefined){
            //make sure the choice contains text
            if(req.body[choice+i].replace(/\s/g, '').length > 0){
               //add it to the choices array
               choices.push({'choice': req.body[choice+i], 'votes': 0});
            }
            i++;
         } else {
            //stop the loop if choice<i> does not exist
            break;
         }
      }
      console.log('CHOICE: '+choices);
      poll.title = req.body.title;
      poll.choices = choices;
      poll.save( function(err) {
         if (err){
            req.flash('pollMessage', err);
            res.redirect(createPollRedirect);
         }

         User.update({_id: req.user.id}, {$push: {pollsOwned: poll._id}}, function(err, raw){
            if (err){
               req.flash('pollMessage', err);
               res.redirect(createPollRedirect);
            }
            else {
               console.log('linked user to poll');
            }
            res.redirect('/'+req.user.username+'/profile');
         });
      });
   }
};

exports.deletePoll = function(req, res){
   if (req.user){
      console.log('deleting: '+req.body.pollId);
      Poll.remove({_id: req.body.pollId}, function(err){
         if(err){
            req.flash('profileMessage', 'Unable to delete poll: '+req.body.pollId);
         } else {
            req.user.pollsOwned.splice(req.user.pollsOwned.indexOf(req.body.pollId), 1);
            req.user.save(function(err){
               req.flash('profileMessage', err);
            });
         }
         res.redirect('/'+req.user.username+'/profile');
      });
   } else {
      req.flash('signinMessage', 'Please sign in to manage your polls.');
      res.redirect('/signin');
   }
};

exports.sharePoll = function(req, res){

};

exports.mapPollIdToTitle = function(req, res, next){
   if (req.user){
      var inPollsOwned = {$in: req.user.pollsOwned};
      Poll.find({_id: inPollsOwned}, function(err, polls){
         if (err){
            req.flash('pollMessage', err);
            return next();
         }
         req.pollIdTitleMap = {};
         polls.forEach(function(poll){
            req.pollIdTitleMap[poll._id] = poll.title;
         });
         next();
      });
   } else {
      return next();
   }
};

exports.renderProfile = function(req, res){
   if(req.user){
      res.render('profile',
         {
            message: req.flash('profileMessage'),
            user: req.user,
            pollIdToTitleMap: req.pollIdTitleMap
         });
   } else {
      res.redirect('/signin');
   }
};

exports.getUserPollList = function (req, res) {
   if (req.user){
      User.findById(req.user._id, function(err, user){
         if (err) {
            console.log(err);
         } else {
            console.log(user.pollsOwned);
         }
      });
   }
   res.redirect('/signin');
};
