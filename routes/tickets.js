const express = require('express');
const router = new express.Router();
const Ticket = require('../models/ticket');

router.get('/all', (req, res) => {
    Ticket.fetchAll().then(function(result) {
        res.status(200).json({
            tickets: result
        });
    })
});

router.get('/ticket/:id', (req, res) => {
    Ticket.where('id', req.params.id).fetch().then(function(result) {
        res.status(200).json({
            ticket: result
        });
    })
});

router.post('/create', ensureModerator, (req, res) => {
    req.checkBody('event_id', 'Ticket event_id is required.').notEmpty();
    req.checkBody('quantity', 'Tickets quantity is required.').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.status(200).json({
            errors
        });
    } else {
        const ticket = {
            id: req.body.id,
            event_id: req.body.event_id,
            quantity: req.body.quantity
        }

        Ticket.create(ticket).then(function() {
            res.status(200).json({
                message: "Created ticket."
            });
        }, function(err) {
            res.status(400).json({
                message: err
            });
        });
    }
});

router.put('/update/:id', ensureModerator, (req, res) => {
    req.checkBody('event_id', 'Ticket event_id is required.').notEmpty();
    req.checkBody('quantity', 'Tickets quantity is required.').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.status(200).json({
            errors
        });
    } else {
        const ticket = {
            event_id: req.body.event_id,
            quantity: req.body.quantity
        }

        Ticket.where('id', req.params.id).fetch().then(function(result) {
            result.set(ticket).save().then(function(model) {
                res.status(200).json({
                    message: "Updated ticket."
                });
            }, function(err) {
                res.status(400).json({
                    message: err
                });
            });
        })
    }
});

router.delete('/id/:id', ensureModerator, function(req, res) {
    new Ticket({id: req.params.id})
    .destroy()
    .then(function(model) {
        res.status(200).json({
            message: "Deleted ticket."
        });
    }, function(err) {
        res.status(400).json({
            message: err
        });
    });
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