var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

var user = require('./routes/user');
var customer = require('./routes/customer');
var admin = require('./routes/admin');
var product = require('./routes/product');
var cart = require('./routes/cart');

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("B4c0/\/", salt);

var expressValidator = require('express-validator');
var flash = require('connect-flash');
var app = express();

//var upload = multer({ dest: '/public/uploads/' })
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var uri = 'mongodb://localhost:27017/shopping';
// var uri = "mongodb://vinhtai:gameover@cluster0-shard-00-00.8s0ta.mongodb.net:27017,cluster0-shard-00-01.8s0ta.mongodb.net:27017,cluster0-shard-00-02.8s0ta.mongodb.net:27017/shopping?ssl=true&replicaSet=atlas-2nq7z2-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(uri, { useMongoClient: true });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(session({
  secret: 'vinhtai',
  resave: true,
  key: 'user',
  saveUninitialized: true

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});





app.use('/', admin);
app.use('/admin', admin);
app.use('/admin/user', user);
app.use('/admin/customer', customer);
app.use('/admin/product', product);
app.use('/admin/cart', cart);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
