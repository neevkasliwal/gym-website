'use client';

import { useState } from 'react';
import './contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Typically this would call our backend API
      // const res = await fetch('http://localhost:5000/api/contact', { ... });
      setStatus({ type: 'success', text: 'Message sent successfully. We will get back to you soon!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <h1 className="animate-fade-in">GET IN TOUCH</h1>
          <p>Have questions? We're here to help.</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>CONTACT INFO</h2>
            <p>Ready to start your fitness journey? Reach out to us or visit our facility today.</p>
            
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h3>ADDRESS</h3>
                <p>123 Iron Street, Muscle City, MC 90210</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <h3>PHONE</h3>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div>
                <h3>EMAIL</h3>
                <p>info@ironcorefitness.com</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>SEND A MESSAGE</h2>
            {status && (
              <div className={`form-status ${status.type}`}>
                {status.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Subject"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your Message"
                  rows="5"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">SEND MESSAGE</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
