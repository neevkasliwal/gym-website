'use client';

import { useState, useEffect } from 'react';
import { paymentAPI } from '../../../services/api';
import './dashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await paymentAPI.getAll();
        setPayments(data);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await paymentAPI.approve(id);
      setPayments(payments.map(p => p._id === id ? { ...p, status: 'approved' } : p));
      alert('Payment approved and membership activated!');
    } catch (err) {
      alert('Failed to approve: ' + err.message);
    }
  };

  // Mock data for other stats
  const adminData = {
    name: 'Admin User',
    stats: {
      totalMembers: 1245,
      activeClasses: 24,
      monthlyRevenue: '$45,200',
      newSignups: 32
    },
    recentBookings: [
      { id: 1, member: 'Sarah Jenkins', class: 'Yoga Flow', date: 'May 10, 2026', status: 'Confirmed' },
      { id: 2, member: 'Mike Ross', class: 'CrossFit', date: 'May 10, 2026', status: 'Pending' },
      { id: 3, member: 'Jessica Pearson', class: 'Pilates', date: 'May 11, 2026', status: 'Confirmed' }
    ]
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <h3>{adminData.name}</h3>
          <p className="admin-role">System Administrator</p>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Manage Members
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            Manage Classes
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'trainers' ? 'active' : ''}`}
            onClick={() => setActiveTab('trainers')}
          >
            Trainers
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments
          </button>
        </nav>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <div className="admin-header-row">
              <h2>Dashboard Overview</h2>
              <button className="btn btn-primary btn-sm">Generate Report</button>
            </div>
            
            <div className="admin-stats-grid mt-4">
              <div className="admin-stat-card">
                <h3>Total Members</h3>
                <p className="admin-stat-value">{adminData.stats.totalMembers}</p>
                <p className="admin-stat-desc text-success">↑ 12% from last month</p>
              </div>
              <div className="admin-stat-card">
                <h3>Active Classes</h3>
                <p className="admin-stat-value text-accent">{adminData.stats.activeClasses}</p>
                <p className="admin-stat-desc">This week</p>
              </div>
              <div className="admin-stat-card">
                <h3>Monthly Revenue</h3>
                <p className="admin-stat-value text-success">{adminData.stats.monthlyRevenue}</p>
                <p className="admin-stat-desc text-success">↑ 8% from last month</p>
              </div>
              <div className="admin-stat-card">
                <h3>New Signups</h3>
                <p className="admin-stat-value">{adminData.stats.newSignups}</p>
                <p className="admin-stat-desc">This week</p>
              </div>
            </div>

            <div className="admin-section mt-8">
              <div className="admin-section-header">
                <h3>Recent Bookings</h3>
                <button className="btn btn-outline btn-sm">View All</button>
              </div>
              
              <div className="admin-table-container mt-4">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Member</th>
                      <th>Class</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminData.recentBookings.map(booking => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>{booking.member}</td>
                        <td>{booking.class}</td>
                        <td>{booking.date}</td>
                        <td>
                          <span className={`status-badge ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn edit-btn">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="animate-fade-in">
            <div className="admin-header-row">
              <h2>Manage Members</h2>
              <button className="btn btn-primary btn-sm">+ Add Member</button>
            </div>
            <p className="mt-4 text-secondary">Member management interface will go here.</p>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-fade-in">
            <div className="admin-header-row">
              <h2>Pending Payments</h2>
            </div>
            
            <div className="admin-table-container mt-4">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Plan</th>
                    <th>UTR / Transaction ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.filter(p => p.status === 'pending').map(payment => (
                    <tr key={payment._id}>
                      <td>{payment.userId?.name || 'Unknown'}</td>
                      <td>{payment.userId?.email || 'N/A'}</td>
                      <td>₹{payment.amount}</td>
                      <td>{payment.planType}</td>
                      <td className="text-neon">{payment.transactionId}</td>
                      <td>
                        <span className="status-badge pending">Pending</span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleApprove(payment._id)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                  {payments.filter(p => p.status === 'pending').length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-secondary">
                        No pending payments to review.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-section mt-8">
              <h3>Approved History</h3>
              <div className="admin-table-container mt-4">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Transaction ID</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.filter(p => p.status === 'approved').map(payment => (
                      <tr key={payment._id}>
                        <td>{payment.userId?.name || 'Unknown'}</td>
                        <td>₹{payment.amount}</td>
                        <td>{payment.transactionId}</td>
                        <td>{new Date(payment.transactionDate).toLocaleDateString()}</td>
                        <td>
                          <span className="status-badge confirmed">Approved</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
