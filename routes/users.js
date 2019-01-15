const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const Role = require('../models/role');

router.get('/all', ensureAdmin, (req, res) => {
    User.fetchAll().then(function(result) {
        res.status(200).json({
            events: result
        });
    }, function(err) {
        res.status(400).json({
            message: err
        });
    });
});

router.get('/user/:email', ensureAdmin, (req, res) => {
    User.where('email', req.params.email).fetch().then(function(result) {
        res.status(200).json({
            event: result
        });
    }, function(err) {
        res.status(400).json({
            message: err
        });
    });
});

router.put('/update/:email', ensureAdmin, (req, res) => {
    req.checkBody('role_id', 'Role id is required.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.status(200).json({
            errors
        });
    } else {
        Role.where('id', req.body.role_id).fetch().then(function(result) {
            if (result) {
                const user = {
                    roles_id: req.body.role_id
                }

                User.where('email', req.params.email).fetch().then(function(result) {
                    if (result) {
                        const user_role_id = result.get("roles_id");
                        if (user_role_id == 3) {
                            res.status(400).json({
                                message: "Nie mozesz zmienić roli innego admina."
                            });
                        } else {
                            result.set(user).save().then(function(model) {
                                res.status(200).json({
                                    message: "Updated user."
                                });
                            }, function(err) {
                                res.status(400).json({
                                    message: err
                                });
                            });
                        }
                    } else {
                        res.status(400).json({
                            message: "Nie znaleziono użytkownika o podanym id."
                        });
                    }
                })
            } else {
                res.status(400).json({
                    message: "Nie znaleziono roli o podanym id."
                });
            }
        }, function(err) {
            res.status(400).json({
                message: err
            });
        });
    }
});

function ensureAdmin(req, res, next) {
    if(typeof res.locals.userRole !== "undefined" && res.locals.userRole === 3) {
        return next();
    } else {
        res.status(400).json({
            failureMessage : "Nie jesteś uprawiony do wykonania tej operacji."
        });
    }
}

module.exports = router;