import './about.css';
import Link from 'next/link';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1 className="animate-fade-in">OUR STORY</h1>
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

        <div className="features-section mt-8">
          <h2 className="text-center">WHY CHOOSE US</h2>
          <div className="features-grid">
            <div className="feature-card animate-slide-left stagger-1 hover-glow">
              <div className="feature-icon">🏋️</div>
              <h3>PREMIUM EQUIPMENT</h3>
              <p>Train with the best. Our facility is equipped with top-tier machines and free weights.</p>
            </div>
            <div className="feature-card animate-fade-in stagger-2 hover-glow">
              <div className="feature-icon">👨‍🏫</div>
              <h3>EXPERT TRAINERS</h3>
              <p>Learn from professionals who are dedicated to helping you achieve your specific goals.</p>
            </div>
            <div className="feature-card animate-slide-right stagger-3 hover-glow">
              <div className="feature-icon">🕒</div>
              <h3>24/7 ACCESS</h3>
              <p>Your goals don't have a schedule. Workout whenever fits your lifestyle.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
