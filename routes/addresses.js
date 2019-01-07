const express = require('express');
const router = new express.Router();
const Address = require('../models/address');

router.get('/all', (req, res) => {
    Address.fetchAll().then(function(result) {
        res.status(200).json({
            addresses: result
        });
    })
});

router.get('/address/:id', (req, res) => {
    Address.where('id', req.params.id).fetch().then(function(result) {
        res.status(200).json({
            address: result
        });
    })
});

router.post('/create', ensureModerator, (req, res) => {
    req.checkBody('addressline1', 'Address addressline1 is required.').notEmpty();
    req.checkBody('addressline2', 'Address addressline2 is required.').notEmpty();
    req.checkBody('sity', 'Address sity is required.').notEmpty();
    req.checkBody('state', 'Address state is required.').notEmpty();
    req.checkBody('postal_code', 'Address postal_code is required.').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.status(200).json({
            errors
        });
    } else {
        const address = {
            id: req.body.id,
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            sity: req.body.sity,
            state: req.body.state,
            postal_code: req.body.postal_code
        }

        Address.create(address).then(function() {
            res.status(200).json({
                message: "Created address."
            });
        }, function(err) {
            res.status(400).json({
                message: err
            });
        });
    }
});

router.put('/update/:id', ensureModerator, (req, res) => {
    req.checkBody('addressline1', 'Address addressline1 is required.').notEmpty();
    req.checkBody('addressline2', 'Address addressline2 is required.').notEmpty();
    req.checkBody('sity', 'Address sity is required.').notEmpty();
    req.checkBody('state', 'Address state is required.').notEmpty();
    req.checkBody('postal_code', 'Address postal_code is required.').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        res.status(200).json({
            errors
        });
    } else {
        const address = {
            id: req.body.id,
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            sity: req.body.sity,
            state: req.body.state,
            postal_code: req.body.postal_code
        }

        Address.where('id', req.params.id).fetch().then(function(result) {
            result.set(address).save().then(function(model) {
                res.status(200).json({
                    message: "Updated address."
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
    new Address({id: req.params.id})
    .destroy()
    .then(function(model) {
        res.status(200).json({
            message: "Deleted address."
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