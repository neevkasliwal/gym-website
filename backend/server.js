const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

app.get('/', (req, res) => {
  res.send('Gym API is running');
});

// Database connection
const connectDB = async () => {
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('Mock MongoDB Connected at', mongoUri);

    // Initialize mock classes if empty
    const Class = require('./models/Class');
    const count = await Class.countDocuments();
    if (count === 0) {
      await Class.insertMany([
        { name: 'HIIT Extreme', trainer: 'Alex Johnson', capacity: 20, difficulty: 'Advanced', schedule: { day: 'Monday', time: '18:00' } },
        { name: 'Power Yoga', trainer: 'Sarah Williams', capacity: 15, difficulty: 'Beginner', schedule: { day: 'Tuesday', time: '07:00' } },
      ]);
      console.log('Mock classes initialized');
    }

  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
