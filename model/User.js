var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var User = new Schema({
    name: String,
    username: String,
    password: String,
    role: String,
}, {collection: 'user'});

module.exports = mongoose.model('User', User);
