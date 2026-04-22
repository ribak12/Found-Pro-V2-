const mongoose = require('mongoose');

const metaItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const valueItemSchema = new mongoose.Schema(
  {
    testName: { type: String, required: true },
    result: { type: String, required: true },
    range: { type: String, required: true }
  },
  { _id: false }
);

const labReportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    accessCode: {
      type: String,
      required: true,
      trim: true
    },
    patientDob: {
      type: String,
      default: ''
    },
    patientName: {
      type: String,
      required: true
    },
    test: {
      type: String,
      required: true
    },
    date: {
      type: String,
      default: ''
    },
    eta: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['collected', 'processing', 'ready'],
      default: 'collected'
    },
    pdfUrl: {
      type: String,
      default: ''
    },
    previewTitle: {
      type: String,
      default: 'Report preview'
    },
    previewText: {
      type: String,
      default: ''
    },
    meta: {
      type: [metaItemSchema],
      default: []
    },
    chips: {
      type: [String],
      default: []
    },
    values: {
      type: [valueItemSchema],
      default: []
    },
    valuesNote: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LabReport', labReportSchema);
