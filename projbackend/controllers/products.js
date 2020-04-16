const Product = require('../models/category');
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