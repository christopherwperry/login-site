const express = require('express');
const parseurl = require('parseurl');
const mustache = require('mustache-express');
const session = require('express-session')
const bodyParser = require('body-parser');
const data = require('./users.js')
const port = 3000;
const path = require('path');
const app = express();

app.engine('mustache', mustache());
app.set('views', ['./views']);
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

function checkUser(req, username, password){
  let authUser = data.users.find(function(user){
    if (username === user.username && password === user.password) {
      req.session.authenticated = true;
      console.log("User & Password Authenticated");
    } else {
      return false;
    };
  });
  console.log(req.session);
  return req.session;
};

app.get('/', function(req,res){
  res.render('login');
});

app.post("/", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  checkUser(req, username, password);
  if(req.session && req.session.authenticated){
    res.render('index', {username: username});
  } else {
    res.redirect('/');
  }
});

app.listen(port, function(){
  console.log("The server is running on port 3000");
});
