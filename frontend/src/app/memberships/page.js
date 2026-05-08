'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { planAPI } from '../../services/api';
import './memberships.css';

export default function MembershipsPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await planAPI.getAll();
        setPlans(data);
      } catch {
        // Fallback to empty
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="memberships-page animate-fade-in">
      <header className="memberships-hero">
        <div className="container">
          <h1 className="memberships-title">
            MEMBERSHIPS <span className="text-neon">THAT FIT</span>
          </h1>
          <p className="memberships-subtitle text-secondary">
            No hidden fees. Cancel anytime. Upgrade when you're ready.
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
          <p className="text-secondary">Pick a plan today. All prices in ₹ (INR).</p>
        </div>

        {loading ? (
          <div className="text-center text-secondary">Loading plans...</div>
        ) : (
          <div className="memberships-grid">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={[
                  'card',
                  'membership-card',
                  plan.isPopular ? 'featured' : '',
                ].join(' ')}
              >
                {plan.isPopular && <div className="popular-badge">Most Popular</div>}

                <h3 className="membership-name">{plan.name}</h3>
                <div className="membership-price">
                  ₹{plan.price?.toLocaleString('en-IN')}
                  <span>/{plan.durationLabel}</span>
                </div>

                <ul className="membership-features">
                  {plan.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>

                <Link
                  href="/auth/register"
                  className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'} w-100 mt-4 text-center`}
                >
                  Select {plan.name}
                </Link>
              </div>
            ))}
          </div>
        )}

        <section className="membership-faq mt-8">
          <div className="section-header text-center mb-8">
            <h2>
              Questions? <span className="text-neon">We've got you</span>
            </h2>
            <p className="text-secondary">Quick answers before you join.</p>
          </div>

          <div className="faq-grid">
            <div className="card faq-item">
              <h3>Can I cancel anytime?</h3>
              <p className="text-secondary">Yes. Your membership can be cancelled or paused anytime.</p>
            </div>
            <div className="card faq-item">
              <h3>How do I pay?</h3>
              <p className="text-secondary">Pay via UPI (GPay, PhonePe, Paytm). Submit your UTR number and we'll verify within 24 hours.</p>
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
