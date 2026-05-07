const ContactMessage = require('../models/ContactMessage');

exports.createMessage = async (req, res) => {
  try {
    const message = new ContactMessage(req.body);
    const createdMessage = await message.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
