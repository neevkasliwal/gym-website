import Link from 'next/link';
import './home.css';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content container">
          <h1 className="animate-fade-in">UNLEASH YOUR<br/><span className="text-neon">POTENTIAL</span></h1>
          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Experience the ultimate fitness journey with premium equipment, elite trainers, and a community that pushes you further.
          </p>
          <div className="hero-cta animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/auth/register" className="btn btn-primary">Join Now</Link>
            <Link href="/classes" className="btn btn-outline">Free Trial</Link>
          </div>
        </div>
        <div className="hero-overlay"></div>
      </section>

      <section className="features container">
        <div className="section-header text-center mb-8">
          <h2>Why Choose <span className="text-neon">IronCore</span></h2>
          <p className="text-secondary">We provide everything you need to reach your goals.</p>
        </div>
        <div className="features-grid">
          <div className="card feature-card text-center animate-slide-left stagger-1">
            <div className="feature-icon">🏋️‍♂️</div>
            <h3>Premium Equipment</h3>
            <p className="text-secondary">State-of-the-art machines and free weights for every type of workout.</p>
          </div>
          <div className="card feature-card text-center animate-fade-in stagger-2 hover-glow">
            <div className="feature-icon">👥</div>
            <h3>Elite Trainers</h3>
            <p className="text-secondary">Certified professionals dedicated to your success and safety.</p>
          </div>
          <div className="card feature-card text-center animate-slide-right stagger-3">
            <div className="feature-icon">🧘‍♀️</div>
            <h3>Dynamic Classes</h3>
            <p className="text-secondary">From high-intensity interval training to relaxing yoga sessions.</p>
          </div>
        </div>
      </section>

      <section className="membership-preview">
        <div className="container">
          <div className="section-header text-center mb-8">
            <h2>Start Your <span className="text-neon">Journey</span></h2>
            <p className="text-secondary">Choose the plan that fits your lifestyle.</p>
          </div>
          <div className="pricing-grid">
            <div className="card pricing-card text-center animate-fade-in stagger-1">
              <h3>Basic</h3>
              <div className="price">$49<span>/mo</span></div>
              <ul>
                <li>Access to gym floor</li>
                <li>Locker room access</li>
                <li>Free Wi-Fi</li>
              </ul>
              <Link href="/auth/register" className="btn btn-outline mt-4">Select Plan</Link>
            </div>
            <div className="card pricing-card featured text-center animate-fade-in stagger-2" style={{ animationName: 'pulseNeon', animationDuration: '3s', animationIterationCount: 'infinite' }}>
              <div className="popular-badge">Most Popular</div>
              <h3>Standard</h3>
              <div className="price">$79<span>/mo</span></div>
              <ul>
                <li>All Basic features</li>
                <li>Unlimited classes</li>
                <li>1 PT session/month</li>
              </ul>
              <Link href="/auth/register" className="btn btn-primary mt-4">Select Plan</Link>
            </div>
            <div className="card pricing-card text-center animate-fade-in stagger-3">
              <h3>Premium</h3>
              <div className="price">$119<span>/mo</span></div>
              <ul>
                <li>All Standard features</li>
                <li>Unlimited PT sessions</li>
                <li>Spa & Recovery access</li>
              </ul>
              <Link href="/auth/register" className="btn btn-outline mt-4">Select Plan</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
