const express = require('express');
const validator = require('validator');
const passport = require('passport');

const router = new express.Router();

/**
 * Validate the sign up form
 * 
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result, errors tips, 
 *                      and a global message for the whole form.
 */
function validateSignupForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if(!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = "Wprowadź poprawny adres email.";
    }

    if(!payload || typeof payload.password !== 'string' ||payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = "Hasło musi posiadać conajmniej 8 znaków.";
    }

    if(!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
        isFormValid = false;
        errors.name = "Podaj swoję imię.";
    }

    if(!isFormValid) {
        message = "Sprawdź czy wystąpiły błędy.";
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

/**
 * Validate the login form
 * 
 * @param {object} paylaod - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result, errors tips, 
 *                      and a global message for the whole form.
 */
function validateLoginForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if(!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
        isFormValid = false;
        errors.email = "Proszę wprowadzić swój adres email.";
    }

    if(!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid=false;
        errors.password = "Proszę wprowadzić swoje hasło.";
    }

    if(!isFormValid) {
        message = "Sprawdź czy wystąpiły błędy.";
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

router.post('/signup', (req, res, next) => {
    const validationResult = validateSignupForm(req.body);
    if(!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    return passport.authenticate('local-signup', (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY' && err.errno === 1062) {
                return res.status(409).json({
                    success: false,
                    message: 'Sprawdź czy wystąpiły błędy.',
                    errors: {
                        email: 'Ten email jest już zajęty.'
                    }
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Wystąpił nieznany błąd.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Rejestracja zakoczona. Teraz możesz się zalogować.'
        });
    })(req, res, next);
});

router.post('/login', (req, res, next) => {
    const validationResult = validateLoginForm(req.body);
    if(!validationResult.success) {
        return res.status(400).json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    return passport.authenticate('local-login', (err, token, userData) => {
        if (err) {
            if (err.name === 'IncorrectCredentialsError') {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            console.log(err);

            return res.status(400).json({
                success: false,
                message: 'Wystąpił nieznany błąd.'
            });
        }

        return res.json({
            success: true,
            message: 'Udało się zalogować!',
            token,
            user: userData
        });
    })(req, res, next);
});

module.exports = router;