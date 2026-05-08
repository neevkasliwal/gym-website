'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, bookingAPI } from '../../../services/api';
import './dashboard.css';

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [memberData, setMemberData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          authAPI.getProfile(),
          bookingAPI.getMyBookings()
        ]);
        setMemberData(profileRes);
        setBookings(bookingsRes);
      } catch (err) {
        console.error('Failed to load member data:', err);
        // If unauthorized, redirect to login
        if (err.message === 'API request failed' || err.message.includes('token')) {
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) {
    return <div className="dashboard-container flex-center text-secondary">Loading dashboard...</div>;
  }

  if (!memberData) {
    return <div className="dashboard-container flex-center text-secondary">Failed to load dashboard.</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="user-profile">
          <div className="user-avatar">{memberData.name ? memberData.name.charAt(0).toUpperCase() : 'U'}</div>
          <h3>{memberData.name}</h3>
          <p className="user-role">Member</p>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-btn ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            My Classes
          </button>
          <button 
            className={`nav-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            Billing
          </button>
          <button 
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <h2>Welcome back, {memberData.name ? memberData.name.split(' ')[0] : 'Member'}!</h2>
            
            <div className="stats-grid mt-4">
              <div className="stat-card">
                <h3>Current Plan</h3>
                <p className="stat-value">{memberData.membershipStatus === 'active' ? 'Premium' : 'Free'}</p>
                <p className="stat-desc">Member since {new Date(memberData.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="stat-card">
                <h3>Classes Booked</h3>
                <p className="stat-value text-accent">{bookings.length}</p>
                <p className="stat-desc">Total confirmed</p>
              </div>
              <div className="stat-card">
                <h3>Next Billing</h3>
                <p className="stat-value">{memberData.membershipExpiry ? new Date(memberData.membershipExpiry).toLocaleDateString() : 'N/A'}</p>
                <p className="stat-desc">Subscription info</p>
              </div>
            </div>

            <div className="content-section mt-8">
              <h3>Upcoming Classes</h3>
              {bookings.length > 0 ? (
                <div className="classes-list mt-4">
                  {bookings.map(booking => (
                    <div key={booking._id} className="class-item">
                      <div className="class-info">
                        <h4>{booking.classId?.name || 'Class'}</h4>
                        <p>{new Date(booking.bookingDate).toLocaleDateString()}</p>
                      </div>
                      <button className="btn btn-outline btn-sm">Cancel</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-secondary">No upcoming classes scheduled.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="animate-fade-in">
            <h2>My Classes</h2>
            <p className="mt-4">You can manage your booked classes here.</p>
            {/* Class management UI would go here */}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="animate-fade-in">
            <h2>Membership & Billing</h2>
            
            <div className="stats-grid mt-4">
              <div className="stat-card">
                <h3>Membership Status</h3>
                <p className={`stat-value ${memberData.membershipStatus === 'active' ? 'text-neon' : 'text-secondary'}`}>
                  {memberData.membershipStatus.toUpperCase()}
                </p>
                <p className="stat-desc">Plan: {memberData.membershipStatus === 'active' ? 'Premium' : 'None'}</p>
              </div>
            </div>

            <div className="billing-container mt-8">
              <div className="card billing-card">
                <h3>Upgrade to <span className="text-neon">Premium</span></h3>
                <p className="text-secondary mb-4">Pay ₹999 for 30 days of full access.</p>
                
                <div className="qr-section text-center mb-6">
                  <img src="/payment_qr.png" alt="Payment QR Code" className="payment-qr" />
                  <p className="mt-2 text-secondary">Scan with any UPI app</p>
                  <p className="font-bold text-neon">neevkasliwal-1@okicici</p>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const transactionId = e.target.transactionId.value;
                  if (!transactionId) return alert('Please enter Transaction ID');
                  
                  try {
                    await paymentAPI.create({
                      amount: 999,
                      planType: 'Monthly Premium',
                      transactionId
                    });
                    alert('Payment submitted! Admin will verify and approve your membership soon.');
                    e.target.reset();
                  } catch (err) {
                    alert('Failed to submit payment: ' + err.message);
                  }
                }}>
                  <div className="input-group">
                    <label htmlFor="transactionId">Transaction ID / UTR</label>
                    <input 
                      type="text" 
                      id="transactionId" 
                      name="transactionId"
                      className="input-field" 
                      placeholder="Enter 12-digit UTR number"
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Submit Payment Info</button>
                </form>
              </div>

              <div className="content-section mt-8">
                <h3>Payment History</h3>
                <p className="text-secondary mt-2">No previous payments found.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
