var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var bodyParser=require('body-parser');
var passport=require('passport');
var exphbs = require("express-handlebars");
var MySQLStore = require('express-mysql-session')(session);
var http = require('http');


var db = require("./models");
var indexRouter = require('./controllers/index');
var AccountsRouter = require('./controllers/accounts');
var StatusRouter = require('./controllers/status');
var FavouritesRouter = require('./controllers/favourites');


var app = express();

var PORT = process.env.PORT || 8080;

 
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'socionet'
};
 

var sessionStore = new MySQLStore(options);
// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
  key:'user_sid',
  secret: 'mysecret',
  store: sessionStore,
  resave: true,
  saveUninitialized: false,
  cookie: {
      expires: false
  }
}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.engine("handlebars", exphbs({
  defaultLayout: "main",
  helpers: {
    toJSON : function(object) {
      return JSON.stringify(object);
    }
  }
}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine","handlebars");



require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session()); 


app.use('/', indexRouter);
app.use('/users', AccountsRouter);
app.use('/status', StatusRouter);
app.use('/favourites', FavouritesRouter);




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

var server = http.createServer(app);

db.sequelize.sync().then(function(){
  // server.listen(PORT,function(){
    server.listen(PORT, function(){
      console.log("Listening on localhost:" + PORT);
  })
})




// //SOCKET 
// var io = require('socket.io')(server);

// io.on('connection',function(socket){
//   console.log('new user connected');
//   socket.on('post-new-status',function(data){
//     if(data != ''){
//       console.log('in')

//       socket.broadcast.emit('new-post-available');
//     }
//   });
  

// });



module.exports = server;
