var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Customer = new Schema({
    customerId: String,
    name: String,
    address: String,
    phone: String,
    customerType: String,

}, {collection: 'customer'});

module.exports = mongoose.model('Customer', Customer);
