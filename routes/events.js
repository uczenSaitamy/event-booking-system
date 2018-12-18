const express = require('express');
const router = new express.Router();
const Event = require('../models/event');

router.post('/create', ensureModerator, (req, res) => {
    req.checkBody('title', 'Event title is required.').notEmpty();
    req.checkBody('body', 'Event description is required.').notEmpty();
    req.checkBody('address_id', 'Event address is required.').notEmpty();
    req.checkBody('date', 'Event date is required.').notEmpty();
    req.checkBody('date', 'Event date should be added in correct format.').isISO8601();

    let errors = req.validationErrors();

    if(errors) {
        res.status(200).json({
            errors
        });
    } else {
        const event = {
            id: 2,
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
    }
});

function ensureAuthenticated(req, res, next) {
    if(typeof res.locals.userRole !== "undefined" && (res.locals.userRole === 1 || res.locals.userRole === 2 || res.locals.userRole === 3)) {
        return next();
    } else {
        res.status(400).json({
            failureMessage : "Nie jesteś uprawiony do wykonania tej operacji."
        });
    }
}
  
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