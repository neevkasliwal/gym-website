'use client';

import { useState, useEffect } from 'react';
import './trainers.css';
import Link from 'next/link';
import { trainerAPI } from '../../services/api';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await trainerAPI.getAll();
        setTrainers(data);
      } catch (err) {
        console.error('Failed to fetch trainers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <div className="trainers-page">
      <div className="trainers-header">
        <div className="container">
          <h1 className="animate-fade-in">MEET OUR <span className="text-neon">TEAM</span></h1>
          <p>Certified professionals. One mission: your results.</p>
        </div>
      </div>

      <div className="container py-8">
        {loading ? (
          <div className="text-center text-secondary">Loading trainers...</div>
        ) : (
          <div className="trainers-grid">
            {trainers.map((trainer, index) => (
              <div key={trainer._id} className={`trainer-card animate-fade-in stagger-${(index % 5) + 1}`}>
                <div className="trainer-image">
                  <img src={trainer.image || 'https://via.placeholder.com/300x400?text=Trainer'} alt={trainer.name} />
                  <div className="trainer-overlay">
                    <div className="trainer-certs">
                      {trainer.certifications?.map(cert => (
                        <span key={cert} className="cert-badge">{cert}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="trainer-info">
                  <h3>{trainer.name}</h3>
                  <p className="specialization">{trainer.specialization}</p>
                  <p className="trainer-bio">{trainer.bio}</p>
                  <div className="trainer-meta">
                    <span className="experience-badge">{trainer.experience} YRS EXP</span>
                    {trainer.classes?.length > 0 && (
                      <div className="trainer-classes">
                        {trainer.classes.map(cls => (
                          <span key={cls} className="class-tag">{cls}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link href="/contact" className="btn btn-outline btn-full">BOOK A SESSION</Link>
                </div>
              </div>
            ))}
            {trainers.length === 0 && (
               <div className="text-center text-secondary mt-8 w-100" style={{ gridColumn: '1 / -1' }}>No trainers found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
