const Class = require('../models/Class');

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find({});
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const createdClass = await newClass.save();
    res.status(201).json(createdClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (classData) {
      Object.assign(classData, req.body);
      const updatedClass = await classData.save();
      res.json(updatedClass);
    } else {
      res.status(404).json({ message: 'Class not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (classData) {
      await classData.deleteOne();
      res.json({ message: 'Class removed' });
    } else {
      res.status(404).json({ message: 'Class not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
