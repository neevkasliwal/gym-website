import './about.css';
import Link from 'next/link';

const STATS = [
  { value: '5,000+', label: 'Active Members' },
  { value: '8', label: 'Expert Trainers' },
  { value: '9', label: 'Class Types' },
  { value: '24/7', label: 'Access' },
];

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1 className="animate-fade-in">OUR <span className="text-neon">STORY</span></h1>
          <p className="animate-slide-up">Forged in iron. Built on dedication.</p>
        </div>
      </div>
      
      <section className="about-content container py-8">
        <div className="about-grid">
          <div className="about-text">
            <h2>WHO WE ARE</h2>
            <p>IronCore Fitness was founded with a single mission: to create a premium environment where serious fitness enthusiasts and beginners alike can push their limits. We believe that a gym shouldn't just be a room with weights—it should be an experience, a community, and a proving ground.</p>
            <p>With state-of-the-art equipment, world-class trainers, and an atmosphere designed to inspire, we provide everything you need to transform your body and mind.</p>
            <Link href="/classes" className="btn btn-primary mt-4">VIEW OUR CLASSES</Link>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop" alt="Gym Interior" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section mt-8">
          <div className="stats-grid">
            {STATS.map(stat => (
              <div key={stat.label} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="features-section mt-8">
          <h2 className="text-center">WHY CHOOSE US</h2>
          <div className="features-grid">
            <div className="feature-card animate-slide-left stagger-1 hover-glow">
              <div className="feature-icon">🏋️</div>
              <h3>PREMIUM EQUIPMENT</h3>
              <p>Train with the best. Our facility is equipped with top-tier machines and free weights from Rogue, Eleiko, and Hammer Strength.</p>
            </div>
            <div className="feature-card animate-fade-in stagger-2 hover-glow">
              <div className="feature-icon">👨‍🏫</div>
              <h3>EXPERT TRAINERS</h3>
              <p>Learn from 8 certified professionals who are dedicated to helping you achieve your specific fitness goals safely.</p>
            </div>
            <div className="feature-card animate-slide-right stagger-3 hover-glow">
              <div className="feature-icon">🕒</div>
              <h3>24/7 ACCESS</h3>
              <p>Your goals don't have a schedule. Workout whenever fits your lifestyle with keycard access around the clock.</p>
            </div>
            <div className="feature-card animate-slide-left stagger-4 hover-glow">
              <div className="feature-icon">🧘</div>
              <h3>9 CLASS TYPES</h3>
              <p>From HIIT and Boxing to Yoga and Pilates—find the group class that matches your energy and goals.</p>
            </div>
            <div className="feature-card animate-fade-in stagger-5 hover-glow">
              <div className="feature-icon">🥗</div>
              <h3>NUTRITION COACHING</h3>
              <p>Unlock your potential with personalized nutrition plans crafted by our certified sports nutritionists.</p>
            </div>
            <div className="feature-card animate-slide-right stagger-1 hover-glow">
              <div className="feature-icon">💆</div>
              <h3>SPA & RECOVERY</h3>
              <p>Premium members enjoy access to sauna, cold plunge, and recovery lounge for optimal rest and muscle repair.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
