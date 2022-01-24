//jshint esversion:6

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});

//REGISTER
app.post("/register", function(req, res) {
  const newUser = User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});


//LOGIN
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne(
    {email: username},
    function(err, foundUser) {
      if(err) {
        console.log(err);
      } else {
        if(foundUser) {
          if(foundUser.password === password) {
            console.log("You are successfully logged in");
            res.render("secrets");
          }
        } else {
          console.log("Either email or password is incorrect");
        }
      }
    }
  );
});
















app.listen(3000, function() {
  console.log("Server started on port 3000");
});
