const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  planType: { type: String, required: true },
  transactionId: { type: String, required: true }, // UTR/Transaction ID from UPI
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  transactionDate: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
});

module.exports = mongoose.model('Payment', paymentSchema);
