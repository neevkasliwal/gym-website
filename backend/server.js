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
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
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

// Seed default data
const seedDefaultData = async () => {
  const MembershipPlan = require('./models/MembershipPlan');
  const Class = require('./models/Class');
  const Trainer = require('./models/Trainer');
  const User = require('./models/User');

  // Seed plans if empty
  const planCount = await MembershipPlan.countDocuments();
  if (planCount === 0) {
    await MembershipPlan.insertMany([
      {
        name: 'Basic',
        durationDays: 30,
        durationLabel: '1 Month',
        price: 999,
        features: ['Gym floor access', 'Locker room access', 'Free Wi-Fi'],
        isPopular: false,
      },
      {
        name: 'Standard',
        durationDays: 30,
        durationLabel: '1 Month',
        price: 1999,
        features: ['All Basic features', 'Unlimited group classes', '1 PT session/month', 'Diet consultation'],
        isPopular: true,
      },
      {
        name: 'Premium',
        durationDays: 30,
        durationLabel: '1 Month',
        price: 2999,
        features: ['All Standard features', 'Unlimited PT sessions', 'Spa & Recovery access', 'Nutrition coaching'],
        isPopular: false,
      },
      {
        name: 'Quarterly Standard',
        durationDays: 90,
        durationLabel: '3 Months',
        price: 4999,
        features: ['All Standard features', '3 months access', 'Save ₹998 vs monthly'],
        isPopular: false,
      },
      {
        name: 'Annual Premium',
        durationDays: 365,
        durationLabel: '1 Year',
        price: 24999,
        features: ['All Premium features', '12 months access', 'Save ₹10,989 vs monthly', 'Priority booking'],
        isPopular: false,
      },
    ]);
    console.log('Default membership plans seeded');
  }

  // Seed classes if empty
  const classCount = await Class.countDocuments();
  if (classCount === 0) {
    await Class.insertMany([
      { title: 'HIIT Inferno', category: 'Cardio', trainer: 'Alex Johnson', day: 'Mon / Wed / Fri', time: '6:00 AM', capacity: 20, difficulty: 'Advanced', description: 'An explosive high-intensity interval session designed to torch calories.', icon: '🔥' },
      { title: 'Power Yoga', category: 'Mind & Body', trainer: 'Sarah Mitchell', day: 'Tue / Thu / Sat', time: '7:00 AM', capacity: 25, difficulty: 'Beginner', description: 'A flowing vinyasa-style class that builds strength and flexibility.', icon: '🧘' },
      { title: 'Strength Foundations', category: 'Strength', trainer: 'David Chen', day: 'Mon / Wed / Fri', time: '8:00 AM', capacity: 15, difficulty: 'Beginner', description: 'Master squats, deadlifts, bench press with expert coaching.', icon: '🏋️' },
      { title: 'Spin Surge', category: 'Cardio', trainer: 'Priya Kapoor', day: 'Tue / Thu', time: '5:30 PM', capacity: 30, difficulty: 'Intermediate', description: 'High-energy indoor cycling with interval climbs and sprints.', icon: '🚴' },
      { title: 'Boxing Bootcamp', category: 'Combat', trainer: 'Marcus Rivera', day: 'Mon / Wed / Fri', time: '6:30 PM', capacity: 18, difficulty: 'Intermediate', description: 'Boxing drills, heavy-bag work, and bodyweight exercises.', icon: '🥊' },
      { title: 'CrossFit WOD', category: 'Functional', trainer: 'Emma Davis', day: 'Mon–Sat', time: '7:00 AM', capacity: 16, difficulty: 'Advanced', description: 'Constantly varied functional movements at high intensity.', icon: '💪' },
    ]);
    console.log('Default classes seeded');
  }

  // Seed trainers if empty
  const trainerCount = await Trainer.countDocuments();
  if (trainerCount === 0) {
    await Trainer.insertMany([
      { name: 'Alex Johnson', specialization: 'Strength & Conditioning', experience: 8, bio: 'Former competitive powerlifter with NSCA-CSCS certification.', certifications: ['NSCA-CSCS', 'CPR/AED'], classes: ['HIIT Inferno'], image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Sarah Mitchell', specialization: 'Yoga & Mobility', experience: 5, bio: 'RYT-500 certified yoga instructor blending traditional vinyasa with modern mobility.', certifications: ['RYT-500', 'FRC Mobility'], classes: ['Power Yoga'], image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop' },
      { name: 'David Chen', specialization: 'Olympic Lifting', experience: 10, bio: 'National-level Olympic weightlifting coach.', certifications: ['USAW Level 2', 'NASM-CPT'], classes: ['Strength Foundations'], image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Emma Davis', specialization: 'CrossFit & Functional', experience: 7, bio: 'CrossFit Level 3 trainer and former regional competitor.', certifications: ['CF-L3', 'Precision Nutrition'], classes: ['CrossFit WOD'], image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Marcus Rivera', specialization: 'Boxing & Combat', experience: 12, bio: 'Professional boxing coach with 12+ years in combat sports.', certifications: ['USA Boxing', 'ACE-CPT'], classes: ['Boxing Bootcamp'], image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Priya Kapoor', specialization: 'Spin & Dance Fitness', experience: 6, bio: 'High-energy group fitness instructor certified in indoor cycling and Zumba.', certifications: ['Schwinn Cycling', 'Zumba Licensed'], classes: ['Spin Surge'], image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000&auto=format&fit=crop' },
    ]);
    console.log('Default trainers seeded');
  }

  // Create default admin if none exists
  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount === 0) {
    await User.create({
      name: 'Admin',
      email: 'admin@ironcore.com',
      password: 'admin123',
      role: 'admin',
      membershipStatus: 'active',
    });
    console.log('Default admin created: admin@ironcore.com / admin123');
  }
};

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    await seedDefaultData();
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
