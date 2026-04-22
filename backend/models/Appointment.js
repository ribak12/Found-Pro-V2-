const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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
      trim: true,
      lowercase: true,
      default: ''
    },
    service: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      default: 'Booked'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
