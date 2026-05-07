const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  certifications: { type: String },
  experience: { type: Number },
  bio: { type: String },
  image: { type: String },
});

module.exports = mongoose.model('Trainer', trainerSchema);
