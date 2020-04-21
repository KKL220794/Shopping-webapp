const Product = require('../models/product');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

exports.getProductById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                message: "no product found"
            });
        }
        req.product = product;
        next()
    });
}

exports.createProduct = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, field, file) => {
        if(err) {
            return res.status(400).json({
                message: 'unable to parse image'
            })
        }

        const { name, description, price, category, stocks} = field;
        if (!name || !description || !price || !category || !stocks) {
            return res.status(400).json({
                message: 'all fields are required'
            });
        }

        const product = new Product(field);
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    message: 'file size too big'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((err, prod) => {
            if(err) {
                return res.status(400).json({
                    message: 'unable to create product'
                })
            }
            return res.status(200).json({
                message: 'product created successfully',
                prod
            })
        });    
    });
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.status(200).json(req.product)
}

exports.photo = (req, res, next) => {
    if(req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.deleteProduct = (req, res) => {
    const product = req.product;
    product.remove((err, prod) => {
        if(err) {
            return res.status(400).json({
                message: 'unable to delete product'
            })
        }
        return res.status(200).json({
            message: 'product deleted successfully',
        })
    })
}

exports.updateProduct = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, field, file) => {
        if(err) {
            return res.status(400).json({
                message: 'unable to parse image'
            })
        }

        // updating product
        const product = req.product;
        product = _.extend(product, field);

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    message: 'file size too big'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to DB
        product.save((err, prod) => {
            if(err) {
                return res.status(400).json({
                    message: 'unable to create product'
                })
            }
            return res.status(200).json({
                message: 'product created successfully',
                prod
            })
        });    
    });
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find().select('-photo').populate("category").limit(limit).sort([[sortBy, 'asc']]).exec((err, products) => {
        if (err) {
            return res.status(400).json({
                message: 'No products found in DB'
            })
        }
        return products
    })
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id},
                update: {$inc : {stocks: -prod.count, sold: +prod.count}}
            }
        }
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                message: 'No products found in DB'
            })
        }
        next();
    })
}

exports.uniqueCategory = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                message: 'No category found in DB'
            })
        }
        return res.status(200).json(category);
    })
}