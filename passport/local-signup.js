const User = require('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Address = require('../models/address');

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
      address_id: req.body.address_id.trim(),
      roles_id: 1
    };
  
    Address.where('id', req.body.address_id.trim()).fetch().then(function(result) {
      if (result) {
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
      } else {
        return done("ADDRESS_NOT_FOUND");
      }
  }, function(err) {
      res.status(400).json({
          message: err
      });
  });
});
