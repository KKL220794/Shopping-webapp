const {Order, ProductCart} = require('../models/order');

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id).populate('products.product', 'name price').exec((err, order) => {
        if (err || !order) {
            return res.status(400).json({
                message: "no order found"
            });
        }
        req.order = order;
        next()
    });
}

exports.createOrder = (req, res) => {

    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                message: 'unable to create order'
            })
        }
        return res.status(200).json(order)
    })
}

exports.getAllOrder = (req, res) => {
    Order.find().populate('user', ['_id name email']).exec((err, order) => {
        if (err || !order) {
            return res.status(400).json({
                message: "no order found"
            });
        }
        res.status(200).json(order);
    });
}

exports.updateStatus = (req, res) => {
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err) {
                return res.status(400).json({
                    message: 'unable to update'
                })
            }
            return res.json(order)
        }
    )
}

exports.getOrderStatus = (req, res) => {
    return res.json(Order.schema.path("status").enumValues)
}