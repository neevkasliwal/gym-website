const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getAllBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking);

router.route('/user')
  .get(protect, getUserBookings);

router.route('/all')
  .get(protect, admin, getAllBookings);

module.exports = router;
