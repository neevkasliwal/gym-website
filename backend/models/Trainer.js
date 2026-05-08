const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  certifications: [{ type: String }],
  experience: { type: Number, default: 0 },
  bio: { type: String },
  image: { type: String },
  classes: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
