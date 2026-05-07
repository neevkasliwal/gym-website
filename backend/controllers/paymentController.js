const Payment = require('../models/Payment');
const User = require('../models/User');

exports.createPayment = async (req, res) => {
  try {
    const { amount, planType } = req.body;
    
    const payment = new Payment({
      userId: req.user._id,
      amount,
      planType,
      status: 'completed' // In a real app, this would be updated via webhook from Stripe/Razorpay
    });

    const createdPayment = await payment.save();
    
    // Update user membership status
    const user = await User.findById(req.user._id);
    if (user) {
      user.membershipStatus = 'active';
      // Set expiry 30 days from now
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      user.membershipExpiry = expiry;
      await user.save();
    }

    res.status(201).json(createdPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
