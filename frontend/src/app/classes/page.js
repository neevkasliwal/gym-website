'use client';

import { useState, useEffect } from 'react';
import './classes.css';
import Link from 'next/link';
import { classAPI } from '../../services/api';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classAPI.getAll();
        setClasses(data);
      } catch (err) {
        setError('Failed to load classes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="container py-8 animate-fade-in">
      <div className="section-header text-center mb-8">
        <h2>Our <span className="text-neon">Classes</span></h2>
        <p className="text-secondary">Find the perfect class to crush your goals.</p>
      </div>

      {loading ? (
        <div className="text-center text-secondary">Loading classes...</div>
      ) : error ? (
        <div className="text-center error-message">{error}</div>
      ) : (
        <div className="classes-grid">
          {classes.map((cls, index) => (
            <div key={cls._id || cls.id} className={`card class-card animate-fade-in stagger-${(index % 5) + 1}`}>
              <div className="class-header">
                <h3>{cls.name || cls.title}</h3>
                <span className={`difficulty-badge ${(cls.difficulty || 'beginner').toLowerCase()}`}>
                  {cls.difficulty || 'Beginner'}
                </span>
              </div>
              
              <div className="class-details">
                <p><strong>Trainer:</strong> {cls.trainer?.name || cls.trainer || 'TBA'}</p>
                <p><strong>When:</strong> {cls.schedule?.day || cls.day} at {cls.schedule?.time || cls.time}</p>
                <p><strong>Capacity:</strong> {cls.capacity} spots</p>
              </div>
              
              <Link href="/auth/login" className="btn btn-primary w-100 mt-4 text-center">
                Book Class
              </Link>
            </div>
          ))}
          {classes.length === 0 && (
            <p className="text-center text-secondary w-100" style={{ gridColumn: '1 / -1' }}>No classes available at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
}
