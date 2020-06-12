const Product = require('../models/product');
const formidable = require('formidable'); // we can use multer for file operations
const fs = require('fs');
const _ = require('loadsh');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((error, product) => {
    if (error || !product) {
      return res.status(400).json({
        error: 'Product not found',
      });
    }
    req.product = product; // after getting the product from the database we are making it available in the request object for the front end so that it can be accessed from the req.
    // console.log(req.product);
    // console.log('productById function called');
    // console.log(req.product);
    next();
  });
};

exports.create = (req, res) => {
  // we need to handle form data as we are uploading a file for the product
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; // what ever image we get extensions will be true
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      });
    }
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }
    let product = new Product(fields);
    if (files.photo) {
      //photo is the field that we are uploading from admin panel for each item
      // 1kb= 1000 bytes
      // 1mb =1000000 bytes
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image size should be less than 1mb',
        });
      }
      // console.log(files.photo);
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, result) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

// get individual product details
exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//delete a product
exports.remove = (req, res) => {
  let product = req.product;
  product.remove((error, deletedProduct) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(error),
      });
    }
    res.json({
      // deletedProduct,
      message: 'Product deleted scucessfully',
    });
  });
};

//update a product Info
exports.update = (req, res) => {
  let form = new formidable.IncomingForm(); // these things will chechk the incoming form feilds and parse them
  form.keepExtensions = true; // what ever image we get extensions will be true
  form.parse(req, (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      });
    }

    // Commented the below lines as we do not need admin to update all the fields when updating a product
    // const { name, description, price, category, quantity, shipping } = fields;

    // validating the incoming form fields of the update request and checking if they are empty
    // if (
    //   !name ||
    //   !description ||
    //   !price ||
    //   !category ||
    //   !quantity ||
    //   !shipping
    // ) {
    //   return res.status(400).json({
    //     error: 'All fields are required',
    //   });
    // }

    let product = req.product; // getting the details of the existing product using productById from params function
    product = _.extend(product, fields); // updating the product with the existing fields of the new incoming form

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image size should be less than 1mb',
        });
      }
      // console.log(files.photo);
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, result) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

// We need to display the products to the clients based on the sell or arrival info.
// product by sell = /products?sortBy=sold&order=desc&limit=4
// product by arrival = /products?sortBy=createdAt&order=desc&limit=4
// If no params are sent , return all products to the user.

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc'; // default the products are returned in ascending
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id'; // if we get sortBy as any field from the document we use that or else we sort using document ID.
  let limit = req.query.limit ? parseInt(req.query.limit) : 6; // we can specify the limit in the query or default limit is 6

  // here we will make two request, 1) to get all the product details excepts photos 2) To get photos of all the products
  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          message: 'Products not found',
        });
      }
      res.json(products);
    });
};

// find products based on the request category, other products that has the same  category will be returned
// this will find products related to that particular product queried by its ID
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          message: 'Products not found',
        });
      }
      res.json(products);
    }); // removing the queried product and requesting other products related to it in that category
};

// get all the categories that are used for the products, empty categories that are not assigned to any products will not be returned
exports.listCategories = (req, res) => {
  Product.distinct('category', {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        message: 'Products not found',
      });
    }
    res.json(categories);
  });
};

//  list products by search for react frontend
//  This is to categories in checkbox and price range in radio buttons
//  when user clicks on those checkbox and radio buttons we will make api request and show the products to users based on what he wants

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    // we can not send json response for image
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.listSearch = (req, res) => {
  // create a query object to hold the search value and category value
  const query = {};
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' }; // mongo provide regex for pattern matching
    if (req.query.category && req.query.category != 'All') {
      req.category = req.query.category;
    }

    // find the product based on query object with 2 properties
    // search and category
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.status(200).json(products);
    }).select('-photo');
  }
};

// update the quantity after each item is sold
exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: 'Could not update the quantity of the item',
      });
    }
    next();
  });
  // bulkwrite is a function from mongoDB
};
