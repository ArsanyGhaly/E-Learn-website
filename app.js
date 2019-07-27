var createError = require('http-errors');
//main web framwork
var express = require('express');

//to get the path
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var favicon = require('serve-favicon');
var moment  = require('moment');
//var cookieParser = require('cookie-parser');

//to get the information from the forms
var bodyParser = require('body-parser');

//to deal with the authentication system for users
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const config = require('config-lite')(__dirname)
//to validate the input info
var expressValidator = require('express-validator');

//include multer for file upload
var multer = require('multer');
//set the desitation for the upload folder
//var upload = multer({dest: './uploads'});

//Handle file uploads

var upload = (multer({ dest: './uploads'}));
//to transfare the messageges through the app 
var flash = require('connect-flash');

var bcrypt = require('bcryptjs');
//tp deal with the data base
var mongo = require('mongodb');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/ilearn');
var db = mongoose.connection;

async = require('async');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var classessRouter = require('./routes/class');
var studentRouter = require('./routes/students');
var teacherRouter = require('./routes/teacheres');



var app = express();

// view engine setup
//set the views destination
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//set the environment to dev or production
app.use(logger('dev'));


//app.use(require('connect').bodyParser());
//bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

//make the moment local moment
app.locals.moment = moment;

//make a function to trancate the text with length 
app.locals.truncateText = function(text, length){
  var truncatedText = text.substring(0, length);
  return truncatedText;
}

//app.use(multer({dest:'./uploads'}));
//app.use(express.json());
//important to be true to work with multer or it will cause an error
//app.use(express.urlencoded({ extended: false }));

// Handle Sessions
app.use(session({
  //Name for the session ID cookie. Defaults to 'connect.sid'.
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  

   // Whether to force-save unitialized (new, but not modified) sessions
    // to the store. Defaults to true (deprecated). For login sessions, it
    // makes no sense to save empty sessions for unauthenticated requests,
    // because they are not associated with any valuable data yet, and would
    // waste storage. We'll only save the new session once the user logs in.

  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    // Preferred way to set Expires attribute. Time in milliseconds until
      // the expiry. There's no default, so the cookie is non-persistent.
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  
  // Defaults to MemoryStore, meaning sessions are stored as POJOs
  // in server memory, and are cleared out when the server restarts.
  //store: new MongoStore({// 将 session 存储到 mongodb
    //url: config.mongodb// mongodb 地址
 // })

}));
// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator (copy-past from the docmintation)
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









//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//cookeie parser
app.use(cookieParser());
//set the static files dest
app.use(express.static(path.join(__dirname, 'public')));

//set the flash to work with express-messages  
app.use(flash());
app.use(function (req, res, next) {
 res.locals.messages = require('express-messages')(req, res);
 next();
});

// Makes the user object global in all views
app.get('*', function(req, res, next) {
  // put user into res.locals for easy access from templates
  res.locals.user = req.user || null;
  if(req.user){
    res.locals.type = req.user.type;
  }
  next();
});

// make the user available to every template and the flash messages
app.use((req, res, next) => {
    //res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    req.db = db;
    //req.db2 = db2;
    next();
});




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/classes', classessRouter);
app.use('/students', studentRouter);
app.use('/teachers', teacherRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
