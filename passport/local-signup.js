const User = require('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, email, password, done) => {
    let newUser = {
      email: email.trim(),
      password: password.trim(),
      name: req.body.name.trim(),
      type: 1
    };
  
    bcrypt.genSalt(10, function(saltError, salt){
      if(saltError) { return next(saltError); }
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          return done(err);
        }
        newUser.password = hash;
        newUser.created_at = Date.now();
        newUser.updated_at = newUser.created_at;
        User.create(newUser).then(function() {
            return done(null);
        }, function(err) {
          return done(err);
        });
      });
    });
});
