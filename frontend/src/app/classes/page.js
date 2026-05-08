'use client';

import { useState, useEffect } from 'react';
import './classes.css';
import Link from 'next/link';
import { classAPI } from '../../services/api';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classAPI.getAll();
        setClasses(data);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const categories = ['All', ...new Set(classes.map(c => c.category))];

  const filtered = activeCategory === 'All'
    ? classes
    : classes.filter(c => c.category === activeCategory);

  return (
    <div className="classes-page animate-fade-in">
      <header className="classes-hero">
        <div className="container">
          <h1>
            OUR <span className="text-neon">CLASSES</span>
          </h1>
          <p className="text-secondary">
            From high-intensity cardio to mindful yoga — find the class that matches your fire.
          </p>
        </div>
      </header>

      <div className="container py-8">
        {loading ? (
          <div className="text-center text-secondary">Loading classes...</div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="class-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="classes-grid">
              {filtered.map((cls, index) => (
                <div key={cls._id} className={`card class-card animate-fade-in stagger-${(index % 5) + 1}`}>
                  <div className="class-icon">{cls.icon}</div>
                  <div className="class-header">
                    <h3>{cls.title}</h3>
                    <span className={`difficulty-badge ${cls.difficulty?.toLowerCase()}`}>
                      {cls.difficulty}
                    </span>
                  </div>
                  <span className="class-category-tag">{cls.category}</span>
                  <p className="class-description">{cls.description}</p>
                  
                  <div className="class-details">
                    <p><strong>Trainer:</strong> {cls.trainer}</p>
                    <p><strong>When:</strong> {cls.day} at {cls.time}</p>
                    <p><strong>Capacity:</strong> {cls.capacity} spots</p>
                  </div>
                  
                  <Link href="/contact" className="btn btn-primary w-100 mt-4 text-center">
                    Book Class
                  </Link>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
               <div className="text-center text-secondary mt-8">No classes found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
