const Trainer = require('../models/Trainer');

exports.getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({}).sort({ createdAt: -1 });
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTrainer = async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    const created = await trainer.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    Object.assign(trainer, req.body);
    const updated = await trainer.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    await trainer.deleteOne();
    res.json({ message: 'Trainer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
