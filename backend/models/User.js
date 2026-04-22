const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      match: /^\d{10}$/
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    pinHash: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
