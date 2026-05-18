const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /.+@.+\..+/
    },
    department: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr),
        message: 'Skills must be an array'
      }
    },
    performanceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 60
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);

