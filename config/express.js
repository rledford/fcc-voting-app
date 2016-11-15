var path = process.cwd(),
   express = require('express'),
   session = require('express-session'),
   passport = require('passport'),
   flash = require('connect-flash'),
   bodyParser = require('body-parser'),
   cookieParser = require('cookie-parser'),
   morgan = require('morgan');

module.exports = function () {
   var app = express();

   //configure app to use /controllers and /public as folders  to server static
   //files from app/controllers and app/public
   app.use('/controllers', express.static(process.cwd()+'/app/controllers'));
   app.use('/public', express.static(process.cwd()+'/public'));

   //use session and passport
   //the express-session must be initialized before passports
   app.use( session({
      secret: 'secretVoteApp',//session secret
      resave: false,
      saveUninitialized: true
   }));

   app.use( cookieParser() );
   app.use( bodyParser.urlencoded( {extended: true} ) );
   app.use( bodyParser.json());
   app.use( passport.initialize() );
   app.use( passport.session() );
   app.use( flash() );
   app.use( morgan('dev'));

   //set static views directory
   //NOTE: views path is relative to the cwd of the app not this file
   app.set('views', './app/views');
   //set view engine
   app.set('view engine', 'ejs');

   //wire routes
   require('../app/routes/poll.server.routes')(app, passport);
   require('../app/routes/users.server.routes')(app, passport);

   return app;
};
