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

// Error Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

app.get('/', (req, res) => {
  res.send('Gym API is running');
});

// Database connection
const connectDB = async () => {
  try {
    const useMockDb = process.env.USE_MOCK_DB === 'true' || !process.env.MONGO_URI;

    if (useMockDb) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('Mock MongoDB Connected at', mongoUri);

      // Initialize mock classes if empty (mock DB only)
      const Class = require('./models/Class');
      const count = await Class.countDocuments();
      if (count === 0) {
        await Class.insertMany([
          { title: 'HIIT Extreme', trainer: 'Alex Johnson', day: 'Monday', time: '18:00', capacity: 20, difficulty: 'Advanced' },
          { title: 'Power Yoga', trainer: 'Sarah Williams', day: 'Tuesday', time: '07:00', capacity: 15, difficulty: 'Beginner' },
          { title: 'Strength Foundations', trainer: 'Mike Carter', day: 'Wednesday', time: '19:00', capacity: 18, difficulty: 'Intermediate' },
          { title: 'Spin Burn', trainer: 'Emily Chen', day: 'Thursday', time: '06:30', capacity: 22, difficulty: 'Beginner' },
          { title: 'Core & Conditioning', trainer: 'Jordan Lee', day: 'Friday', time: '17:30', capacity: 20, difficulty: 'Intermediate' },
          { title: 'Weekend Warrior', trainer: 'Priya Singh', day: 'Saturday', time: '09:00', capacity: 25, difficulty: 'Advanced' },
        ]);
        console.log('Mock classes initialized');
      }

      // Initialize default admin if none exists
      const User = require('./models/User');
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        await User.create({
          name: 'System Admin',
          email: 'admin@ironcore.com',
          password: 'admin123',
          role: 'admin'
        });
        console.log('Default admin created: admin@ironcore.com / admin123');
      }

      const userExists = await User.findOne({ email: 'user@ironcore.com' });
      if (!userExists) {
        await User.create({
          name: 'Test Member',
          email: 'user@ironcore.com',
          password: 'user123',
          role: 'member'
        });
        console.log('Default member created: user@ironcore.com / user123');
      }
    } else {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB Connected');
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
