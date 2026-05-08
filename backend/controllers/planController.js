const MembershipPlan = require('../models/MembershipPlan');

exports.getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({}).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const { name, durationDays, durationLabel, price, features, isPopular } = req.body;
    const plan = new MembershipPlan({ name, durationDays, durationLabel, price, features, isPopular });
    const created = await plan.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    Object.assign(plan, req.body);
    const updated = await plan.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    await plan.deleteOne();
    res.json({ message: 'Plan removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
