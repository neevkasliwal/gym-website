const express = require('express');
const router = express.Router();
const { getPlans, getAllPlans, createPlan, updatePlan, deletePlan } = require('../controllers/planController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPlans)  // Public - get active plans
  .post(protect, admin, createPlan);

router.route('/all')
  .get(protect, admin, getAllPlans); // Admin - get all plans including inactive

router.route('/:id')
  .put(protect, admin, updatePlan)
  .delete(protect, admin, deletePlan);

module.exports = router;
