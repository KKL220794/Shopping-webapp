const User = require("../models/user");
const Order = require("../models/order");


// function to get the user by id
exports.getUserById = (req, res, next, id) => {
    
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(404).json({
                message: "User Not Found"
            })
        }
        req.profile = user;
        next();
    });
}

// function to get the details the user
exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
}


// function to update the user
exports.updateUser = (req, res) => {

    User.findByIdAndUpdate({_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false}).exec((err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    message: 'user not found in database'
            })
        }

        return res.status(200).json({
            user,
            message: 'User updated successfully'
        })
    })
}

// user purchase list callback
exports.userPurchaseList = (req, res) => {
    Order.find({
        user: req.profile._id
    }).populate("user", "_id name")
    .exec((err, order) => {
        if(err || !user) {
            return res.status(400).json({
                message: 'No order in this account'
            })
        }

        return res.status(200).json(order);
    })
}

//middleware to add purchaselist to the user 

exports.pushProductToPurchaseList = (req, res, next) => {

    let purchaselist = [];
    req.body.order.products.forEach(product => {
        
        purchaselist.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    User.findOneAndUpdate({_id: req.profile._id},
        {$push: {purchases: purchaselist}},
        {new: true}).exec(err, purchase => {
            if(err) {
                return res.status(400).json({
                    message: 'unable to save purchase'
                })
            }
            next();
        });    
}