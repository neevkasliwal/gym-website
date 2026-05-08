'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { paymentAPI, planAPI, authAPI } from '../../../services/api';
import './member.css';

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState('membership');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Payment form state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/auth/login'); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role === 'admin') { router.push('/dashboard/admin'); return; }
    setUser(parsed);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const profileData = await authAPI.getProfile();
      setProfile(profileData);

      if (activeTab === 'buy') {
        const planData = await planAPI.getAll();
        setPlans(planData);
      } else if (activeTab === 'history') {
        const paymentData = await paymentAPI.getMyPayments();
        setPayments(paymentData);
      } else if (activeTab === 'membership') {
        const paymentData = await paymentAPI.getMyPayments();
        setPayments(paymentData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan || !utrNumber.trim()) {
      setError('Please select a plan and enter your UTR number');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await paymentAPI.create({
        planId: selectedPlan._id,
        amount: selectedPlan.price,
        planName: selectedPlan.name,
        durationDays: selectedPlan.durationDays,
        transactionId: utrNumber.trim(),
      });
      setSuccess('Payment submitted! Your request is under review. You will be notified once approved.');
      setUtrNumber('');
      setSelectedPlan(null);
      setShowPaymentForm(false);
      setTimeout(() => { setSuccess(''); setActiveTab('membership'); loadData(); }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusInfo = () => {
    if (!profile) return {};
    const status = profile.membershipStatus;
    const expiry = profile.membershipExpiry ? new Date(profile.membershipExpiry) : null;
    const isExpired = expiry && expiry < new Date();

    if (status === 'active' && !isExpired) {
      const daysLeft = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
      return {
        status: 'Active',
        color: 'status-active',
        plan: profile.membershipPlan || 'N/A',
        expiry: expiry.toLocaleDateString('en-IN'),
        daysLeft,
        message: `Your membership is active. ${daysLeft} days remaining.`,
      };
    } else if (status === 'pending') {
      return {
        status: 'Pending',
        color: 'status-pending',
        message: 'Your payment is under review. Please wait for admin approval.',
      };
    } else {
      return {
        status: 'Inactive',
        color: 'status-inactive',
        message: 'You don\'t have an active membership. Choose a plan to get started!',
      };
    }
  };

  const tabs = [
    { key: 'membership', label: 'My Membership', icon: '🏆' },
    { key: 'buy', label: 'Buy Membership', icon: '💳' },
    { key: 'history', label: 'Payment History', icon: '📄' },
  ];

  if (!user) return null;

  const statusInfo = getStatusInfo();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome, <span className="text-neon">{user.name?.split(' ')[0]}</span></h1>
          <p>Manage your membership and track your fitness journey.</p>
        </div>
      </div>

      <div className="container dashboard-layout">
        <aside className="dashboard-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`sidebar-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="sidebar-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="dashboard-content">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              {/* MY MEMBERSHIP */}
              {activeTab === 'membership' && (
                <div>
                  <h2>My Membership</h2>
                  <div className="membership-status-card card">
                    <div className="status-header">
                      <span className={`status-badge ${statusInfo.color}`}>{statusInfo.status}</span>
                      {statusInfo.plan && <span className="plan-name">{statusInfo.plan}</span>}
                    </div>
                    <p className="status-message">{statusInfo.message}</p>
                    {statusInfo.expiry && (
                      <div className="status-details">
                        <div className="stat-item">
                          <span className="stat-label">Expires</span>
                          <span className="stat-value">{statusInfo.expiry}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Days Left</span>
                          <span className="stat-value text-neon">{statusInfo.daysLeft}</span>
                        </div>
                      </div>
                    )}
                    {(statusInfo.status === 'Inactive' || statusInfo.status === 'Active') && (
                      <button className="btn btn-primary mt-4" onClick={() => setActiveTab('buy')}>
                        {statusInfo.status === 'Active' ? 'Renew / Upgrade' : 'Buy Membership'}
                      </button>
                    )}
                  </div>

                  {/* Recent Payments */}
                  {payments.length > 0 && (
                    <div className="mt-4">
                      <h3>Recent Activity</h3>
                      <div className="recent-payments">
                        {payments.slice(0, 3).map(p => (
                          <div key={p._id} className="card payment-mini">
                            <div className="payment-mini-top">
                              <strong>{p.planName}</strong>
                              <span className={`status-badge status-${p.status}`}>
                                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                              </span>
                            </div>
                            <div className="payment-mini-bottom">
                              <span>₹{p.amount?.toLocaleString('en-IN')}</span>
                              <span>{new Date(p.transactionDate).toLocaleDateString('en-IN')}</span>
                            </div>
                            {p.status === 'rejected' && p.rejectionReason && (
                              <p className="rejection-reason">Reason: {p.rejectionReason}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BUY MEMBERSHIP */}
              {activeTab === 'buy' && (
                <div>
                  <h2>Choose a Plan</h2>
                  <p className="text-secondary mb-4">Select a membership plan and complete payment via UPI.</p>

                  <div className="plans-grid">
                    {plans.map(plan => (
                      <div
                        key={plan._id}
                        className={`card plan-card ${plan.isPopular ? 'popular' : ''} ${selectedPlan?._id === plan._id ? 'selected' : ''}`}
                        onClick={() => { setSelectedPlan(plan); setShowPaymentForm(true); }}
                      >
                        {plan.isPopular && <div className="popular-badge">Most Popular</div>}
                        <h3>{plan.name}</h3>
                        <div className="plan-price">₹{plan.price?.toLocaleString('en-IN')}<span>/{plan.durationLabel}</span></div>
                        <ul className="plan-features">
                          {plan.features?.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                        <button className="btn btn-outline w-100 mt-4">
                          {selectedPlan?._id === plan._id ? '✓ Selected' : 'Select Plan'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {showPaymentForm && selectedPlan && (
                    <div className="payment-section card mt-4">
                      <h3>Complete Payment</h3>
                      <div className="payment-info">
                        <div className="payment-summary">
                          <p><strong>Plan:</strong> {selectedPlan.name} ({selectedPlan.durationLabel})</p>
                          <p><strong>Amount:</strong> <span className="text-neon">₹{selectedPlan.price?.toLocaleString('en-IN')}</span></p>
                        </div>
                        
                        <div className="payment-steps">
                          <h4>How to Pay:</h4>
                          <ol>
                            <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
                            <li>Scan the QR code or send ₹{selectedPlan.price?.toLocaleString('en-IN')} to our UPI ID</li>
                            <li>Copy the <strong>UTR Number</strong> from the payment confirmation</li>
                            <li>Paste it below and submit</li>
                          </ol>
                        </div>

                        <div className="qr-section">
                          <img src="/payment_qr.png" alt="Payment QR Code" className="qr-code" />
                          <p className="text-secondary">Scan to pay via UPI</p>
                        </div>
                      </div>

                      <form onSubmit={handlePaymentSubmit} className="utr-form">
                        <div className="input-group">
                          <label htmlFor="utr">UTR / Transaction Reference Number</label>
                          <input
                            type="text"
                            id="utr"
                            className="input-field"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            placeholder="e.g. 432108765432"
                            required
                          />
                        </div>
                        <div className="form-actions">
                          <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Payment'}
                          </button>
                          <button type="button" className="btn btn-outline" onClick={() => { setShowPaymentForm(false); setSelectedPlan(null); }}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* PAYMENT HISTORY */}
              {activeTab === 'history' && (
                <div>
                  <h2>Payment History</h2>
                  <p className="text-secondary mb-4">Track all your payment submissions and their status.</p>
                  {payments.length === 0 ? (
                    <div className="empty-state">
                      <p>No payments yet.</p>
                      <button className="btn btn-primary mt-4" onClick={() => setActiveTab('buy')}>Buy Membership</button>
                    </div>
                  ) : (
                    <div className="table-wrap">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>UTR Number</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map(p => (
                            <tr key={p._id}>
                              <td><strong>{p.planName}</strong></td>
                              <td className="amount-cell">₹{p.amount?.toLocaleString('en-IN')}</td>
                              <td><code className="utr-code">{p.transactionId}</code></td>
                              <td>{new Date(p.transactionDate).toLocaleDateString('en-IN')}</td>
                              <td>
                                <span className={`status-badge status-${p.status}`}>
                                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                </span>
                              </td>
                              <td>
                                {p.status === 'rejected' && p.rejectionReason
                                  ? <span className="rejection-text">{p.rejectionReason}</span>
                                  : p.status === 'approved'
                                  ? <span className="text-secondary">Verified ✓</span>
                                  : <span className="text-secondary">Under review</span>
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
