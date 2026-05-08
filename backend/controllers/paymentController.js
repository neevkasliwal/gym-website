const Payment = require('../models/Payment');
const User = require('../models/User');

exports.createPayment = async (req, res) => {
  try {
    const { amount, planType, transactionId } = req.body;
    
    const payment = new Payment({
      userId: req.user._id,
      amount,
      planType,
      transactionId,
      status: 'pending'
    });

    const createdPayment = await payment.save();
    res.status(201).json(createdPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'name email');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = 'approved';
    payment.verifiedAt = Date.now();
    await payment.save();

    // Update user membership status
    const user = await User.findById(payment.userId);
    if (user) {
      user.membershipStatus = 'active';
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      user.membershipExpiry = expiry;
      await user.save();
    }

    res.json({ message: 'Payment approved successfully', payment });
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
