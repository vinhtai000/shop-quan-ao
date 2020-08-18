var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Order = new Schema({
  name 		:  String,
  email 	: String,
  sdt 		: String,
  msg 		: String,
  cart 		: Object,
  st 		: Number

},{collection : 'order'});

module.exports = mongoose.model('Order', Order);
