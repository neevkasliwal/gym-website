const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  durationDays: { type: Number, required: true },
  durationLabel: { type: String, required: true }, // e.g. "1 Month", "3 Months", "1 Year"
  price: { type: Number, required: true }, // Price in INR (₹)
  features: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
