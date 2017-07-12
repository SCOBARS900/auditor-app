var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

router.get('/', function(req, res) {
   res.render('login.ejs', { message: req.flash('loginMessage') }); 
});

router.post('/', passport.authenticate('local-login', {
  successRedirect: '/success',
  failureRedirect: '/',
  failureFlash: true,
}));


router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.get('/success', isLoggedIn, function(req, res) {
  res.render('success.ejs');
});


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});













module.exports = router;