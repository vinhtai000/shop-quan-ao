var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Product = new Schema({
  productId     : String,
  name 			: String,
  search	    : String,
  img 			: String,
  cate 		    : String,
  des 			: String,
  price 		: Number,
  quantity 		: Number


},{collection : 'product'});

module.exports = mongoose.model('Product', Product);
