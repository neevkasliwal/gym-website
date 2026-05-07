const Booking = require('../models/Booking');
const Class = require('../models/Class');

exports.createBooking = async (req, res) => {
  try {
    const { classId } = req.body;
    
    // Check if class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const booking = new Booking({
      userId: req.user._id,
      classId,
      status: 'confirmed'
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('classId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('userId', 'name email').populate('classId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
