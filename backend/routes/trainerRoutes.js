const express = require('express');
const router = express.Router();
const { getTrainers, createTrainer, updateTrainer, deleteTrainer } = require('../controllers/trainerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTrainers)  // Public
  .post(protect, admin, createTrainer);

router.route('/:id')
  .put(protect, admin, updateTrainer)
  .delete(protect, admin, deleteTrainer);

module.exports = router;
