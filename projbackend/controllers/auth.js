const User = require('../models/user');
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

// callback for signout api
exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: 'user signed out'
    });
}

// callback for the signup API
exports.signup = (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                message: 'unable to save to database'
            })
        }
        return res.json({
            message: 'data saved successfully',
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        })
    });
}


//callback for the signIn API
exports.signin = (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
    }

    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                message: 'email not found'
            });
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                message: 'email and password do not match'
            });
        }

        // create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET);

        //store in cookie
        res.cookie("token", token, {expire: new Date() + 9999});

        const {_id, name, email, role} = user;
        res.json({
            token,
            user: {
                _id, name, email,role
            }
        });
    });
}

// middleware callback to check if the user is SignedIn
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

// middleware callback to check if the user is Authenticated
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;

    if(!checker) {
        return res.status(403).json({
            message: 'access denied'
        });
    }
    next();
}

// middleware callback to check if the user is Admin
exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            message: 'you are not admin'
        });
    }
    next();
}
