const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const Category = require('./category');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // any spaces in the beginning or at the end are trimmed out.
      required: true,
      maxlength: 32,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true,
      maxlength: 32,
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      required: false,
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
