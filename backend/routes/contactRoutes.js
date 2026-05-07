const express = require('express');
const router = express.Router();
const { createMessage, getMessages } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(createMessage)
  .get(protect, admin, getMessages);

module.exports = router;
