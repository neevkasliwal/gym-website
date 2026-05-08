const Payment = require('../models/Payment');
const User = require('../models/User');

exports.createPayment = async (req, res) => {
  try {
    const { planId, amount, planName, durationDays, transactionId } = req.body;

    if (!planId || !amount || !planName || !durationDays || !transactionId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate UTR
    const existing = await Payment.findOne({ transactionId: transactionId.trim() });
    if (existing) {
      return res.status(400).json({ message: 'This UTR number has already been submitted' });
    }

    const payment = new Payment({
      userId: req.user._id,
      planId,
      amount,
      planName,
      durationDays,
      transactionId: transactionId.trim(),
      status: 'pending',
    });

    const createdPayment = await payment.save();

    // Update user status to pending
    await User.findByIdAndUpdate(req.user._id, { membershipStatus: 'pending' });

    res.status(201).json(createdPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email phone')
      .sort({ transactionDate: -1 });
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

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment has already been processed' });
    }

    payment.status = 'approved';
    payment.verifiedAt = Date.now();
    await payment.save();

    // Update user membership status and expiry
    const user = await User.findById(payment.userId);
    if (user) {
      user.membershipStatus = 'active';
      user.membershipPlan = payment.planName;

      // If user has existing active membership, extend from expiry date
      const startDate = (user.membershipExpiry && user.membershipExpiry > new Date())
        ? new Date(user.membershipExpiry)
        : new Date();

      const expiry = new Date(startDate);
      expiry.setDate(expiry.getDate() + payment.durationDays);
      user.membershipExpiry = expiry;
      await user.save();
    }

    res.json({ message: 'Payment approved successfully', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment has already been processed' });
    }

    payment.status = 'rejected';
    payment.rejectionReason = req.body.reason || 'Payment could not be verified';
    payment.verifiedAt = Date.now();
    await payment.save();

    // Check if user has any other pending payments
    const otherPending = await Payment.findOne({
      userId: payment.userId,
      status: 'pending',
      _id: { $ne: payment._id },
    });

    if (!otherPending) {
      // Check if user has active membership
      const user = await User.findById(payment.userId);
      if (user && user.membershipStatus === 'pending') {
        // Check if they have any approved payment with valid expiry
        if (!user.membershipExpiry || user.membershipExpiry < new Date()) {
          user.membershipStatus = 'inactive';
          await user.save();
        } else {
          user.membershipStatus = 'active';
          await user.save();
        }
      }
    }

    res.json({ message: 'Payment rejected', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ transactionDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
