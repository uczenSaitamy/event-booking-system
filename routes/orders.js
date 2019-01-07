const express = require('express');
const router = new express.Router();
const Order = require('../models/order');

router.get('/all', (req, res) => {
    Order.fetchAll().then(function(result) {
        res.status(200).json({
            orders: result
        });
    })
});

router.get('/order/:id', (req, res) => {
    Order.where('id', req.params.id).fetch().then(function(result) {
        res.status(200).json({
            order: result
        });
    })
});

router.post('/create', ensureModerator, (req, res) => {
    req.checkBody('user_id', 'Order user_id is required.').notEmpty();
    req.checkBody('event_id', 'Order event_id is required.').notEmpty();
    req.checkBody('ticket_quantity', 'Orders ticket_quantity is required.').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.status(200).json({
            errors
        });
    } else {
        const order = {
            id: req.body.id,
            user_id: req.body.user_id,
            event_id: req.body.event_id,
            ticket_quantity: req.body.ticket_quantity
        }

        Order.create(order).then(function() {
            res.status(200).json({
                message: "Created order."
            });
        }, function(err) {
            res.status(400).json({
                message: err
            });
        });
    }
});

router.put('/update/:id', ensureModerator, (req, res) => {
    req.checkBody('user_id', 'Order user_id is required.').notEmpty();
    req.checkBody('event_id', 'Order event_id is required.').notEmpty();
    req.checkBody('ticket_quantity', 'Orders ticket_quantity is required.').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.status(200).json({
            errors
        });
    } else {
        const order = {
            id: req.body.id,
            user_id: req.body.user_id,
            event_id: req.body.event_id,
            ticket_quantity: req.body.ticket_quantity
        }

        Order.where('id', req.params.id).fetch().then(function(result) {
            result.set(order).save().then(function(model) {
                res.status(200).json({
                    message: "Updated order."
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
    new Order({id: req.params.id})
    .destroy()
    .then(function(model) {
        res.status(200).json({
            message: "Deleted order."
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