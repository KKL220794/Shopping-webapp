const express = require('express');
const router = express.Router();
const { signout, signup, signin } = require("../controllers/auth")
const { check } = require('express-validator');


router.get('/signout', signout );

router.post('/signup',[
    check('name', 'name should be at least 3 characters').isLength({min:3}),
    check('email', 'email should be valid').isEmail(),
    check('password', 'password should be at least 3 characters').isLength({min:5}),
], signup)

router.post('/signin', [
    check('email').isEmail().withMessage('email is required'),
    check('password').isLength({min:3}).withMessage('password should be at least 3 characters')
],signin)


module.exports = router;