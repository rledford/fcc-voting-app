var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

var Poll = new Schema({
   title: String,
   choices: [ {choice: String, votes: Number} ]
});

//mongoose.model args (<model name for global access>, <schema def>, <name of the collection>
//if the name of the collection is not provided, mongoose will add an 's' to the
//<model name for global access> argument and use all lower case
//in this case it is Poll which mongoose will make the collection name 'polls'
module.exports = mongoose.model('Poll', Poll, 'items');
