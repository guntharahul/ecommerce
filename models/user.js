const mongoose = require('mongoose');
const crypto = require('crypto'); // node js module to hash the password
var uuid = require('uuid');
const { v4: uuidv4 } = require('uuid'); // To generate unique strings

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // any spaces in the beginning or at the end are trimmed out.
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String, // used to generate the hashed password
    role: {
      type: Number,
      default: 0,
    },
    history: {
      //storing the history of the user passes items.
      type: Array,
      default: {},
    },
  },
  { timestamps: true }
);

//virtual fields
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4(); // to use the randon string to hash the password
    this.hashed_password = this.encryptPassword(password); // calling function to encrypt a password
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (error) {
      return '';
    }
  },
};

module.exports = mongoose.model('User', userSchema);
