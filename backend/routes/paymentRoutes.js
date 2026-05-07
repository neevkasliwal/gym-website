const express = require('express');
const router = express.Router();
const { createPayment, getUserPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createPayment);

router.route('/user')
  .get(protect, getUserPayments);

module.exports = router;
