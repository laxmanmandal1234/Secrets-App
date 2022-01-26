//jshint esversion:6
require('dotenv').config();
//require dotenv module as early as possible

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const md5 = require('md5'); //md5 is a JavaScript function for hashing messages
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//to use the SECRET string defined in .env use process.env.VARIABLE_NAME
//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});  //not needed if you are using hash function

//create model only after applying plugin
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
  myPlaintextPassword = req.body.password;
  bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    const newUser = User({
      email: req.body.username,
      password: hash    // Store hash in your password DB.
      // password: req.body.password //this was used for level 1 and 2
      //password: md5(req.body.password)
    });

    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

//LOGIN
app.post("/login", function(req, res) {
  const username = req.body.username;
  // const password = req.body.password; //this was used for level 1 and 2
  //const password = md5(req.body.password);
  myPlaintextPassword = req.body.password;

  User.findOne(
    {email: username},
    function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          bcrypt.compare(myPlaintextPassword, foundUser.password, function(err, result) {
            if(result == true) {
              console.log("You are successfully logged in");
              res.render("secrets");
            } else {
              console.log("Either email or password is incorrect");
            }
        });
      }
    }
  });
});

//NOTE:
// During save(), documents are encrypted and then signed. During find(), documents
// are authenticated and then decrypted



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
