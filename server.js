'use static';

//load .env variables so they can be accessed through 'process.env' calls
require('dotenv').load();

var mongoose = require('./config/mongoose'),
   express = require('./config/express'),
   passport = require('./config/passport');

var db = mongoose();
var app = express();

passport();

var port = 8080;
console.log('listening on port: '+port);
app.listen(port);
