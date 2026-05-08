const express = require('express');
const router = express.Router();
const { createPayment, getUserPayments, getAllPayments, approvePayment, rejectPayment } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createPayment)
  .get(protect, admin, getAllPayments);

router.route('/user')
  .get(protect, getUserPayments);

router.route('/:id/approve')
  .put(protect, admin, approvePayment);

router.route('/:id/reject')
  .put(protect, admin, rejectPayment);

module.exports = router;
