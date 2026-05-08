const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking);

router.route('/user')
  .get(protect, getUserBookings);

router.route('/all')
  .get(protect, admin, getAllBookings);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

router.route('/:id/status')
  .put(protect, admin, updateBookingStatus);

module.exports = router;
