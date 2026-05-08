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

    // Check capacity
    const existingBookings = await Booking.countDocuments({ classId, status: 'confirmed' });
    if (existingBookings >= classData.capacity) {
      return res.status(400).json({ message: 'Class is fully booked' });
    }

    // Prevent duplicate booking
    const alreadyBooked = await Booking.findOne({ userId: req.user._id, classId, status: 'confirmed' });
    if (alreadyBooked) {
      return res.status(400).json({ message: 'You have already booked this class' });
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

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the owner can cancel their booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
