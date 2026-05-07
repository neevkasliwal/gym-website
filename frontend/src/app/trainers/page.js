import './trainers.css';
import Link from 'next/link';

// Mock data (would come from API in production)
const trainers = [
  {
    id: 1,
    name: 'Alex Johnson',
    specialization: 'Strength & Conditioning',
    experience: 8,
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    specialization: 'Yoga & Mobility',
    experience: 5,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'David Chen',
    specialization: 'HIIT & Cardio',
    experience: 6,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Emma Davis',
    specialization: 'Powerlifting',
    experience: 10,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop'
  }
];

export default function Trainers() {
  return (
    <div className="trainers-page">
      <div className="trainers-header">
        <div className="container">
          <h1 className="animate-fade-in">MEET OUR TEAM</h1>
          <p>Expert guidance. Real results.</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="trainers-grid">
          {trainers.map((trainer, index) => (
            <div key={trainer.id} className={`trainer-card animate-fade-in stagger-${(index % 4) + 1}`}>
              <div className="trainer-image">
                <img src={trainer.image} alt={trainer.name} />
              </div>
              <div className="trainer-info">
                <h3>{trainer.name}</h3>
                <p className="specialization">{trainer.specialization}</p>
                <p className="experience">{trainer.experience} Years Experience</p>
                <Link href="/contact" className="btn btn-outline btn-full">BOOK A SESSION</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
