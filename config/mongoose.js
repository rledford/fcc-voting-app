var mongoose = require('mongoose');

module.exports = function () {
   var db = mongoose.connect(process.env.MONGO_LOCAL);

   require('../app/models/poll');
   require('../app/models/user');

   return db;
};
