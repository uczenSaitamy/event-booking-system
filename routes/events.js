const express = require('express');
const router = new express.Router();
const Event = require('../models/event');
const Address = require('../models/address');

router.get('/all', (req, res) => {
    Event.fetchAll().then(function(result) {
        res.status(200).json({
            events: result
        });
    }, function(err) {
        res.status(400).json({
            message: err
        });
    });
});

router.get('/event/:id', (req, res) => {
    Event.where('id', req.params.id).fetch().then(function(result) {
        res.status(200).json({
            event: result
        });
    }, function(err) {
        res.status(400).json({
            message: err
        });
    });
});

router.post('/create', ensureModerator, (req, res) => {
    req.checkBody('title', 'Event title is required.').notEmpty();
    req.checkBody('body', 'Event description is required.').notEmpty();
    req.checkBody('address_id', 'Event address is required.').notEmpty();
    req.checkBody('date', 'Event date is required.').notEmpty();
    req.checkBody('date', 'Event date should be added in correct format.').isISO8601();

    let errors = req.validationErrors();

    if (errors) {
        res.status(200).json({
            errors
        });
    } else {
        Address.where('id', req.body.address_id).fetch().then(function(result) {
            if(result) {
                const event = {
                    id: req.body.id,
                    title: req.body.title,
                    body: req.body.body,
                    address_id: req.body.address_id,
                    date: req.body.date
                }
        
                Event.create(event).then(function() {
                    res.status(200).json({
                        message: "Created event."
                    });
                }, function(err) {
                    res.status(400).json({
                        message: err
                    });
                });
            } else {
                res.status(400).json({
                    message: "Nie znaleziono adresu o podanym id."
                });
            }
        }, function(err) {
            res.status(400).json({
                message: err
            });
        });
    }
});

router.put('/update/:id', ensureModerator, (req, res) => {
    req.checkBody('title', 'Event title is required.').notEmpty();
    req.checkBody('body', 'Event description is required.').notEmpty();
    req.checkBody('address_id', 'Event address is required.').notEmpty();
    req.checkBody('date', 'Event date is required.').notEmpty();
    req.checkBody('date', 'Event date should be added in correct format.').isISO8601();

    let errors = req.validationErrors();

    if (errors) {
        res.status(200).json({
            errors
        });
    } else {
        Address.where('id', req.body.address_id).fetch().then(function(result) {
            if (result) {
                const event = {
                    title: req.body.title,
                    body: req.body.body,
                    address_id: req.body.address_id,
                    date: req.body.date
                }
        
                Event.where('id', req.params.id).fetch().then(function(result) {
                    if (result) {
                        result.set(event).save().then(function(model) {
                            res.status(200).json({
                                message: "Updated event."
                            });
                        }, function(err) {
                            res.status(400).json({
                                message: err
                            });
                        });
                    } else {
                        res.status(400).json({
                            message: "Nie znaleziono wydarzenia o podanym id."
                        });
                    }
                })
            } else {
                res.status(400).json({
                    message: "Nie znaleziono adresu o podanym id."
                });
            }
        }, function(err) {
            res.status(400).json({
                message: err
            });
        });
    }
});

router.delete('/id/:id', ensureModerator, function(req, res) {
    new Event({id: req.params.id})
    .destroy()
    .then(function(model) {
        res.status(200).json({
            message: "Deleted event."
        });
    }, function(err) {
        res.status(400).json({
            message: err
        });
    });
});
  
function ensureModerator(req, res, next) {
    if(typeof res.locals.userRole !== "undefined" && (res.locals.userRole === 2 || res.locals.userRole === 3)) {
        return next();
    } else {
        res.status(400).json({
            failureMessage : "Nie jesteś uprawiony do wykonania tej operacji."
        });
    }
}

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