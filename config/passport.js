var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var configAuth = require('./auth');





module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
    
    
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email':  email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
              var newUser = new User();
              newUser.local.name = req.body.username;
              newUser.local.email = email;
              newUser.local.lastCitySearch = "No Searchs Results";
              newUser.local.password = newUser.generateHash(password);
              newUser.save(function(err) {
                if (err)
                  throw err;
                return done(null, newUser);
              });   
          } else {
            return done(null, false, req.flash('signupMessage', 'Invalid email.'));
          }   
          
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      return done(null, user);
    });
  }));
    
    
  }