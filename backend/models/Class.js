const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  trainer: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  difficulty: { type: String, required: true },
  capacity: { type: Number, required: true },
});

module.exports = mongoose.model('Class', classSchema);
