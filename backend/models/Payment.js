const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
  amount: { type: Number, required: true },
  planName: { type: String, required: true },
  durationDays: { type: Number, required: true },
  transactionId: { type: String, required: true }, // UTR Number from UPI
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  transactionDate: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
});

module.exports = mongoose.model('Payment', paymentSchema);
