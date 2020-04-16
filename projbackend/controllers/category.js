const Category = require('../models/category')

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                message: 'category not found'
            });
        }

        req.category = category;
        next()
    })
}

exports.createCategory = (req, res) => {

    const category = new Category(req.body);
    category.save((err, category) => {
        if(err) {
            return res.status(400).json({
                message: 'unable to create category'
            })
        }
        return res.status(200).json({
            message: 'category created successfully',
            category
        })
    });
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                message: 'No categories found'
            })
        }
        return res.status(200).json(categories)
    });
}

exports.getCategory = (req, res) => {
    return res.status(200).json(req.category);
}

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, category) => {
        if(err) {
            return res.status(400).json({
                message: 'unable to update category'
            })
        }
        return res.status(200).json({
            message: 'category updated successfully',
            category
        })
    });
}

exports.deleteCategory = (req, res) => {
    const category = req.category;

    category.remove((err, category) => {
        if(err) {
            return res.status(400).json({
                message: 'unable to delete category'
            })
        }
        return res.status(200).json({
            message: 'category deleted successfully',
        })
    });
}