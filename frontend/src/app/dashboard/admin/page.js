'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paymentAPI, classAPI, trainerAPI, planAPI, userAPI } from '../../../services/api';
import './admin.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('requests');
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Data states
  const [payments, setPayments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [showClassForm, setShowClassForm] = useState(false);
  const [showTrainerForm, setShowTrainerForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/auth/login'); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== 'admin') { router.push('/dashboard/member'); return; }
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
      if (activeTab === 'requests' || activeTab === 'payment_history' || activeTab === 'approved_rejected') {
        const data = await paymentAPI.getAll();
        setPayments(data);
      } else if (activeTab === 'classes') {
        const data = await classAPI.getAll();
        setClasses(data);
      } else if (activeTab === 'trainers') {
        const data = await trainerAPI.getAll();
        setTrainers(data);
      } else if (activeTab === 'plans') {
        const data = await planAPI.getAllAdmin();
        setPlans(data);
      } else if (activeTab === 'members') {
        const data = await userAPI.getAll();
        setMembers(data.filter(u => u.role === 'member'));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  // PAYMENT ACTIONS
  const handleApprove = async (id) => {
    try {
      await paymentAPI.approve(id);
      showMsg('Payment approved! Membership activated.');
      loadData();
    } catch (err) { setError(err.message); }
  };

  const handleReject = async (id) => {
    try {
      await paymentAPI.reject(id, rejectReason);
      setRejectingId(null);
      setRejectReason('');
      showMsg('Payment rejected.');
      loadData();
    } catch (err) { setError(err.message); }
  };

  // CLASS CRUD
  const handleClassSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);
    data.capacity = Number(data.capacity);
    try {
      if (editItem) {
        await classAPI.update(editItem._id, data);
        showMsg('Class updated!');
      } else {
        await classAPI.create(data);
        showMsg('Class created!');
      }
      setShowClassForm(false);
      setEditItem(null);
      loadData();
    } catch (err) { setError(err.message); }
  };

  const handleDeleteClass = async (id) => {
    if (!confirm('Delete this class?')) return;
    try {
      await classAPI.delete(id);
      showMsg('Class deleted.');
      loadData();
    } catch (err) { setError(err.message); }
  };

  // TRAINER CRUD
  const handleTrainerSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      name: form.get('name'),
      specialization: form.get('specialization'),
      experience: Number(form.get('experience')),
      bio: form.get('bio'),
      image: form.get('image'),
      certifications: form.get('certifications').split(',').map(s => s.trim()).filter(Boolean),
      classes: form.get('classes').split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editItem) {
        await trainerAPI.update(editItem._id, data);
        showMsg('Trainer updated!');
      } else {
        await trainerAPI.create(data);
        showMsg('Trainer added!');
      }
      setShowTrainerForm(false);
      setEditItem(null);
      loadData();
    } catch (err) { setError(err.message); }
  };

  const handleDeleteTrainer = async (id) => {
    if (!confirm('Delete this trainer?')) return;
    try {
      await trainerAPI.delete(id);
      showMsg('Trainer deleted.');
      loadData();
    } catch (err) { setError(err.message); }
  };

  // PLAN CRUD
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      name: form.get('name'),
      durationDays: Number(form.get('durationDays')),
      durationLabel: form.get('durationLabel'),
      price: Number(form.get('price')),
      features: form.get('features').split(',').map(s => s.trim()).filter(Boolean),
      isPopular: form.get('isPopular') === 'on',
      isActive: form.get('isActive') !== 'off',
    };
    try {
      if (editItem) {
        await planAPI.update(editItem._id, data);
        showMsg('Plan updated!');
      } else {
        await planAPI.create(data);
        showMsg('Plan created!');
      }
      setShowPlanForm(false);
      setEditItem(null);
      loadData();
    } catch (err) { setError(err.message); }
  };

  const handleDeletePlan = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await planAPI.delete(id);
      showMsg('Plan deleted.');
      loadData();
    } catch (err) { setError(err.message); }
  };

  const tabs = [
    { key: 'requests', label: 'Requests', icon: '📋' },
    { key: 'payment_history', label: 'Payment History', icon: '💳' },
    { key: 'approved_rejected', label: 'History of Approved/Rejected Request', icon: '📄' },
    { key: 'classes', label: 'Manage Classes', icon: '🏋️' },
    { key: 'trainers', label: 'Manage Trainers', icon: '👥' },
    { key: 'plans', label: 'Manage Plans', icon: '💰' },
    { key: 'members', label: 'Members', icon: '👤' },
  ];

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>Admin <span className="text-neon">Dashboard</span></h1>
          <p>Welcome back, {user.name}</p>
        </div>
      </div>

      <div className="container dashboard-layout">
        <aside className="dashboard-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`sidebar-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setShowClassForm(false); setShowTrainerForm(false); setShowPlanForm(false); setEditItem(null); }}
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
              {/* PAYMENTS TABS */}
              {(activeTab === 'requests' || activeTab === 'payment_history' || activeTab === 'approved_rejected') && (() => {
                const filteredPayments = activeTab === 'requests'
                  ? payments.filter(p => p.status === 'pending')
                  : activeTab === 'approved_rejected'
                    ? payments.filter(p => p.status !== 'pending')
                    : payments;

                const tabTitles = {
                  requests: { title: 'Pending Requests', desc: 'Review new payment submissions and approve or reject memberships.' },
                  payment_history: { title: 'Payment History', desc: 'All payment submissions across all statuses.' },
                  approved_rejected: { title: 'History of Approved/Rejected', desc: 'History of all processed (approved or rejected) requests.' }
                };

                return (
                  <div>
                    <h2>{tabTitles[activeTab].title}</h2>
                    <p className="text-secondary mb-4">{tabTitles[activeTab].desc}</p>
                    {filteredPayments.length === 0 ? (
                      <div className="empty-state">No records found.</div>
                    ) : (
                      <div className="table-wrap">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Member</th>
                              <th>Plan</th>
                              <th>Amount</th>
                              <th>UTR Number</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredPayments.map(p => (
                              <tr key={p._id}>
                                <td>
                                  <div className="member-cell">
                                    <strong>{p.userId?.name || 'Unknown'}</strong>
                                    <small>{p.userId?.email}</small>
                                  </div>
                                </td>
                                <td>{p.planName}</td>
                                <td className="amount-cell">₹{p.amount?.toLocaleString('en-IN')}</td>
                                <td><code className="utr-code">{p.transactionId}</code></td>
                                <td>{new Date(p.transactionDate).toLocaleDateString('en-IN')}</td>
                                <td>
                                  <span className={`status-badge status-${p.status}`}>
                                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                  </span>
                                </td>
                                <td>
                                  {p.status === 'pending' ? (
                                    <div className="action-buttons">
                                      <button className="btn-sm btn-approve" onClick={() => handleApprove(p._id)}>✓ Approve</button>
                                      {rejectingId === p._id ? (
                                        <div className="reject-form">
                                          <input
                                            type="text"
                                            placeholder="Reason (optional)"
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            className="input-field input-sm"
                                          />
                                          <button className="btn-sm btn-reject" onClick={() => handleReject(p._id)}>Confirm</button>
                                          <button className="btn-sm btn-cancel" onClick={() => setRejectingId(null)}>Cancel</button>
                                        </div>
                                      ) : (
                                        <button className="btn-sm btn-reject" onClick={() => setRejectingId(p._id)}>✕ Reject</button>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-secondary">
                                      {p.status === 'rejected' && p.rejectionReason ? `Rejected: ${p.rejectionReason}` : '—'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* MANAGE CLASSES */}
              {activeTab === 'classes' && (
                <div>
                  <div className="section-top">
                    <h2>Manage Classes</h2>
                    <button className="btn btn-primary" onClick={() => { setShowClassForm(true); setEditItem(null); }}>+ Add Class</button>
                  </div>

                  {showClassForm && (
                    <form className="card admin-form" onSubmit={handleClassSubmit}>
                      <h3>{editItem ? 'Edit Class' : 'Add New Class'}</h3>
                      <div className="form-grid">
                        <div className="input-group"><label>Title</label><input name="title" className="input-field" defaultValue={editItem?.title || ''} required /></div>
                        <div className="input-group"><label>Category</label><input name="category" className="input-field" defaultValue={editItem?.category || ''} required placeholder="e.g. Cardio, Strength" /></div>
                        <div className="input-group"><label>Trainer</label><input name="trainer" className="input-field" defaultValue={editItem?.trainer || ''} required /></div>
                        <div className="input-group"><label>Day</label><input name="day" className="input-field" defaultValue={editItem?.day || ''} required placeholder="e.g. Mon / Wed / Fri" /></div>
                        <div className="input-group"><label>Time</label><input name="time" className="input-field" defaultValue={editItem?.time || ''} required placeholder="e.g. 6:00 AM" /></div>
                        <div className="input-group"><label>Difficulty</label>
                          <select name="difficulty" className="input-field" defaultValue={editItem?.difficulty || 'Beginner'}>
                            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                          </select>
                        </div>
                        <div className="input-group"><label>Capacity</label><input name="capacity" type="number" className="input-field" defaultValue={editItem?.capacity || 20} required /></div>
                        <div className="input-group"><label>Icon (emoji)</label><input name="icon" className="input-field" defaultValue={editItem?.icon || '💪'} /></div>
                      </div>
                      <div className="input-group"><label>Description</label><textarea name="description" className="input-field" rows="3" defaultValue={editItem?.description || ''} /></div>
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">{editItem ? 'Update' : 'Create'}</button>
                        <button type="button" className="btn btn-outline" onClick={() => { setShowClassForm(false); setEditItem(null); }}>Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="items-grid">
                    {classes.map(cls => (
                      <div key={cls._id} className="card item-card">
                        <div className="item-header">
                          <span className="item-icon">{cls.icon}</span>
                          <h3>{cls.title}</h3>
                        </div>
                        <p className="text-secondary">{cls.category} · {cls.difficulty}</p>
                        <p className="text-secondary">Trainer: {cls.trainer}</p>
                        <p className="text-secondary">{cls.day} at {cls.time}</p>
                        <p className="text-secondary">Capacity: {cls.capacity}</p>
                        <div className="item-actions">
                          <button className="btn-sm btn-edit" onClick={() => { setEditItem(cls); setShowClassForm(true); }}>Edit</button>
                          <button className="btn-sm btn-reject" onClick={() => handleDeleteClass(cls._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MANAGE TRAINERS */}
              {activeTab === 'trainers' && (
                <div>
                  <div className="section-top">
                    <h2>Manage Trainers</h2>
                    <button className="btn btn-primary" onClick={() => { setShowTrainerForm(true); setEditItem(null); }}>+ Add Trainer</button>
                  </div>

                  {showTrainerForm && (
                    <form className="card admin-form" onSubmit={handleTrainerSubmit}>
                      <h3>{editItem ? 'Edit Trainer' : 'Add New Trainer'}</h3>
                      <div className="form-grid">
                        <div className="input-group"><label>Name</label><input name="name" className="input-field" defaultValue={editItem?.name || ''} required /></div>
                        <div className="input-group"><label>Specialization</label><input name="specialization" className="input-field" defaultValue={editItem?.specialization || ''} required /></div>
                        <div className="input-group"><label>Experience (years)</label><input name="experience" type="number" className="input-field" defaultValue={editItem?.experience || 0} /></div>
                        <div className="input-group"><label>Image URL</label><input name="image" className="input-field" defaultValue={editItem?.image || ''} placeholder="https://..." /></div>
                        <div className="input-group"><label>Certifications (comma separated)</label><input name="certifications" className="input-field" defaultValue={editItem?.certifications?.join(', ') || ''} /></div>
                        <div className="input-group"><label>Classes (comma separated)</label><input name="classes" className="input-field" defaultValue={editItem?.classes?.join(', ') || ''} /></div>
                      </div>
                      <div className="input-group"><label>Bio</label><textarea name="bio" className="input-field" rows="3" defaultValue={editItem?.bio || ''} /></div>
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">{editItem ? 'Update' : 'Create'}</button>
                        <button type="button" className="btn btn-outline" onClick={() => { setShowTrainerForm(false); setEditItem(null); }}>Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="items-grid">
                    {trainers.map(t => (
                      <div key={t._id} className="card item-card trainer-item">
                        {t.image && <img src={t.image} alt={t.name} className="trainer-thumb" />}
                        <div className="trainer-item-info">
                          <h3>{t.name}</h3>
                          <p className="text-neon">{t.specialization}</p>
                          <p className="text-secondary">{t.experience} years experience</p>
                          {t.certifications?.length > 0 && (
                            <div className="cert-tags">
                              {t.certifications.map(c => <span key={c} className="cert-tag">{c}</span>)}
                            </div>
                          )}
                        </div>
                        <div className="item-actions">
                          <button className="btn-sm btn-edit" onClick={() => { setEditItem(t); setShowTrainerForm(true); }}>Edit</button>
                          <button className="btn-sm btn-reject" onClick={() => handleDeleteTrainer(t._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MANAGE PLANS */}
              {activeTab === 'plans' && (
                <div>
                  <div className="section-top">
                    <h2>Manage Membership Plans</h2>
                    <button className="btn btn-primary" onClick={() => { setShowPlanForm(true); setEditItem(null); }}>+ Add Plan</button>
                  </div>

                  {showPlanForm && (
                    <form className="card admin-form" onSubmit={handlePlanSubmit}>
                      <h3>{editItem ? 'Edit Plan' : 'Add New Plan'}</h3>
                      <div className="form-grid">
                        <div className="input-group"><label>Plan Name</label><input name="name" className="input-field" defaultValue={editItem?.name || ''} required /></div>
                        <div className="input-group"><label>Duration (days)</label><input name="durationDays" type="number" className="input-field" defaultValue={editItem?.durationDays || 30} required /></div>
                        <div className="input-group"><label>Duration Label</label><input name="durationLabel" className="input-field" defaultValue={editItem?.durationLabel || ''} required placeholder="e.g. 1 Month, 3 Months" /></div>
                        <div className="input-group"><label>Price (₹)</label><input name="price" type="number" className="input-field" defaultValue={editItem?.price || ''} required /></div>
                      </div>
                      <div className="input-group"><label>Features (comma separated)</label><input name="features" className="input-field" defaultValue={editItem?.features?.join(', ') || ''} /></div>
                      <div className="checkbox-row">
                        <label className="checkbox-label"><input type="checkbox" name="isPopular" defaultChecked={editItem?.isPopular || false} /> Mark as Popular</label>
                        <label className="checkbox-label"><input type="checkbox" name="isActive" defaultChecked={editItem?.isActive !== false} /> Active</label>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">{editItem ? 'Update' : 'Create'}</button>
                        <button type="button" className="btn btn-outline" onClick={() => { setShowPlanForm(false); setEditItem(null); }}>Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="items-grid">
                    {plans.map(plan => (
                      <div key={plan._id} className={`card item-card plan-card ${plan.isPopular ? 'popular' : ''} ${!plan.isActive ? 'inactive-plan' : ''}`}>
                        {plan.isPopular && <div className="popular-badge">Most Popular</div>}
                        {!plan.isActive && <div className="inactive-badge">Inactive</div>}
                        <h3>{plan.name}</h3>
                        <div className="plan-price">₹{plan.price?.toLocaleString('en-IN')}<span>/{plan.durationLabel}</span></div>
                        <ul className="plan-features">
                          {plan.features?.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                        <div className="item-actions">
                          <button className="btn-sm btn-edit" onClick={() => { setEditItem(plan); setShowPlanForm(true); }}>Edit</button>
                          <button className="btn-sm btn-reject" onClick={() => handleDeletePlan(plan._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MEMBERS */}
              {activeTab === 'members' && (
                <div>
                  <h2>Members</h2>
                  <p className="text-secondary mb-4">All registered members and their membership status.</p>
                  {members.length === 0 ? (
                    <div className="empty-state">No members registered yet.</div>
                  ) : (
                    <div className="table-wrap">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>Expiry</th>
                            <th>Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.map(m => (
                            <tr key={m._id}>
                              <td><strong>{m.name}</strong></td>
                              <td>{m.email}</td>
                              <td>{m.membershipPlan || '—'}</td>
                              <td>
                                <span className={`status-badge status-${m.membershipStatus}`}>
                                  {m.membershipStatus.charAt(0).toUpperCase() + m.membershipStatus.slice(1)}
                                </span>
                              </td>
                              <td>{m.membershipExpiry ? new Date(m.membershipExpiry).toLocaleDateString('en-IN') : '—'}</td>
                              <td>{new Date(m.createdAt).toLocaleDateString('en-IN')}</td>
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
