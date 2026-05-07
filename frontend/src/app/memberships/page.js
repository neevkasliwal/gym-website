import Link from 'next/link';
import './memberships.css';

const PLANS = [
  {
    name: 'Basic',
    price: 49,
    period: 'mo',
    tagline: 'Everything you need to get started.',
    features: ['Gym floor access', 'Locker room access', 'Free Wi‑Fi'],
    ctaVariant: 'outline',
  },
  {
    name: 'Standard',
    price: 79,
    period: 'mo',
    tagline: 'Best value for consistent training.',
    features: ['All Basic features', 'Unlimited classes', '1 PT session/month'],
    featured: true,
    ctaVariant: 'primary',
  },
  {
    name: 'Premium',
    price: 119,
    period: 'mo',
    tagline: 'Maximum results with maximum support.',
    features: ['All Standard features', 'Unlimited PT sessions', 'Spa & Recovery access'],
    ctaVariant: 'outline',
  },
];

export default function MembershipsPage() {
  return (
    <div className="memberships-page animate-fade-in">
      <header className="memberships-hero">
        <div className="container">
          <h1 className="memberships-title">
            MEMBERSHIPS <span className="text-neon">THAT FIT</span>
          </h1>
          <p className="memberships-subtitle text-secondary">
            No hidden fees. Cancel anytime. Upgrade when you’re ready.
          </p>
          <div className="memberships-cta">
            <Link href="/auth/register" className="btn btn-primary">
              Join Now
            </Link>
            <Link href="/classes" className="btn btn-outline">
              Explore Classes
            </Link>
          </div>
        </div>
        <div className="memberships-hero-overlay" />
      </header>

      <main className="container py-8">
        <div className="section-header text-center mb-8">
          <h2>
            Choose Your <span className="text-neon">Plan</span>
          </h2>
          <p className="text-secondary">Pick a plan today. Change it anytime.</p>
        </div>

        <div className="memberships-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={[
                'card',
                'membership-card',
                plan.featured ? 'featured' : '',
              ].join(' ')}
            >
              {plan.featured && <div className="popular-badge">Most Popular</div>}

              <h3 className="membership-name">{plan.name}</h3>
              <div className="membership-price">
                ${plan.price}
                <span>/{plan.period}</span>
              </div>
              <p className="membership-tagline text-secondary">{plan.tagline}</p>

              <ul className="membership-features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className={`btn ${plan.ctaVariant === 'primary' ? 'btn-primary' : 'btn-outline'} w-100 mt-4 text-center`}
              >
                Select {plan.name}
              </Link>
            </div>
          ))}
        </div>

        <section className="membership-faq mt-8">
          <div className="section-header text-center mb-8">
            <h2>
              Questions? <span className="text-neon">We’ve got you</span>
            </h2>
            <p className="text-secondary">Quick answers before you join.</p>
          </div>

          <div className="faq-grid">
            <div className="card faq-item">
              <h3>Can I cancel anytime?</h3>
              <p className="text-secondary">Yes. Your membership can be cancelled or paused anytime.</p>
            </div>
            <div className="card faq-item">
              <h3>Is there a free trial?</h3>
              <p className="text-secondary">You can try a class for free before committing to a plan.</p>
            </div>
            <div className="card faq-item">
              <h3>Can I upgrade later?</h3>
              <p className="text-secondary">Absolutely—upgrade or downgrade whenever your goals change.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

