const jwt = require('jsonwebtoken');
const User = require('../models/user');
const jwtSecret = require('../config/jwt');

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).end();
    }

    const token = req.headers.authorization.split(' ')[1];

    return jwt.verify(token, jwtSecret.jwtSecret, (err, decoded) => {
        if (err) { return res.status(401).end(); }

        const userEmail = decoded.sub;

        return User.where({ email: userEmail }).fetchAll().then(function(output) {
            const user = output.serialize()
            if (!user) {
                return res.status(401).end();
            }

            res.locals.userEmail = userEmail;
            res.locals.userRole = user[0].roles_id;
            return next();
        }, function(err) {
            return res.status(401).end();
        })
    });
};