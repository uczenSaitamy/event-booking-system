const jwt = require('jsonwebtoken');
const User = require('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;
const jwtSecret = require('../config/jwt');
const bcrypt = require('bcrypt');


module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, email, password, done) => {
    const userData = {
        email: email.trim(),
        password: password.trim()
    };

    return User.where({ email: userData.email }).fetchAll().then(function(output) {
        const user = output.serialize()

        if (user.length == 0) {
            const error = new Error('Incorrect email or password');
            error.name = 'IncorrectCredentialsError';

            return done(error);
        }

        if (user.length > 1) {
            const error = new Error('There should be only one user with given email');
            error.name = 'MultipleEmailInstances';

            return done(error);
        }

        return bcrypt.compare(password, user[0].password, (passwordErr, isMatch) => {
            if (!isMatch) {
                const error = new Error('Incorrect email or password');
                error.name = 'IncorrectCredentialsError';

                return done(error);
            }

            const payload = {
                sub: user[0].email
            };

            const token = jwt.sign(payload, jwtSecret.jwtSecret, {
                expiresIn: "1d"
            });
            const data = {
                name: user[0].name,
                type: user[0].roles_id
            };

            return done(null, token, data);
        });
    }, function(err) {
        return done(err);
    })
});