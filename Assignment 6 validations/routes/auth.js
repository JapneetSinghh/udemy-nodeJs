const { check, body } = require('express-validator/check');
const express = require('express');
const router = express.Router();
const isAuth = require('../middelwear/is-auth');
const User = require('../models/user');
const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.post('/login',
    [
        body('email').isEmail().withMessage('Please Enter A Valid Email'),
        body('password', 'Please check your password').isLength({ min: 5 }).isAlphanumeric()
    ]
    , authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('PLEASE ENTER A VALID EMAIL')
            .custom((value, { req }) => {
                // if (value === 'test@gmail.com') {
                //     throw new Error('This email address is forbidden');
                // }
                // return true;
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Email already exists, please pick a different one')
                        }
                    })
            }),
        body('password', 'Please enter a password with only numbers and text with at least 5 characters')
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords Have To Match');
                }
                return true;
            })
    ]
    , authController.postSignup);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;