const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

//This function gets called when there is a category param in the request
exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        // error: errorHandler(err),
        message: 'Category does not exist',
      });
    }
    req.category = category;
    next();
  });
};

//create a new Category
exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      data,
    });
  });
};

// Get the category by ID.
exports.read = (req, res) => {
  return res.status(200).json(req.category);
};

// update category
exports.update = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

//delete a category
exports.remove = (req, res) => {
  const category = req.category;
  category.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: 'Category Deleted',
    });
  });
};

//get list of all categories
exports.list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
