const express = require('express');
const parseurl = require('parseurl');
const mustache = require('mustache-express');
const session = require('express-session')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const data = require('./users.js')
const flash = require('req-flash');
const port = 3000;
const path = require('path');
const app = express();


app.engine('mustache', mustache());
app.set('views', ['./views']);
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(flash())

function checkUser(req, username, password){
  let authUser = data.users.find(function(user){
    if (username === user.username && password === user.password) {
      req.session.username = true;
      req.session.password = true;
      console.log("User & Password Authenticated");
    // } else if (username !== user.username && password === user.password) {
    //   req.session.username = false;
    //   req.session.password = true;
    // } else if (username === user.username && password !== user.password){
    //   req.session.username = true;
    //   req.session.password = false;
    } else {
      return false
      // req.session.username = false;
      // req.session.password = false;
    };
  });
  console.log(req.session);
  return req.session;
};

app.get('/', function(req,res){
  res.render('login');
});

app.get('/test', function(req,res) {
    req.flash('successMessage', 'You are successfully using req-flash');
    req.flash('errorMessage', 'No errors, you\'re doing fine');
    res.redirect('/');
});

app.post("/", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  checkUser(req, username, password);
  if(req.session.username && req.session.password){
    res.render('index', {username: username});
  } else {
    req.flash('error', 'Username and password are incorrect');
    res.redirect('/');
  }
});

app.listen(port, function(){
  console.log("The server is running on port 3000");
});
