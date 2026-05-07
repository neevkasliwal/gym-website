import './gallery.css';

const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
    alt: 'Gym training floor',
    tag: 'Gym Area',
  },
  {
    src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop',
    alt: 'Dumbbells and free weights',
    tag: 'Equipment',
  },
  {
    src: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=1600&auto=format&fit=crop',
    alt: 'Weight racks and benches',
    tag: 'Free Weights',
  },
  {
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1600&auto=format&fit=crop',
    alt: 'Treadmills and cardio machines',
    tag: 'Cardio',
  },
  {
    src: 'https://images.unsplash.com/photo-1517964603305-11c0f6f66012?q=80&w=1600&auto=format&fit=crop',
    alt: 'Cable machine station',
    tag: 'Machines',
  },
  {
    src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1600&auto=format&fit=crop',
    alt: 'Modern gym interior',
    tag: 'Facility',
  },
  {
    src: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1600&auto=format&fit=crop',
    alt: 'Kettlebells and functional training area',
    tag: 'Functional',
  },
  {
    src: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?q=80&w=1600&auto=format&fit=crop',
    alt: 'Strength training equipment',
    tag: 'Strength',
  },
];

export const metadata = {
  title: 'Gallery | IronCore Fitness',
  description: 'Explore the IronCore gym floor, equipment, and training spaces.',
};

export default function GalleryPage() {
  return (
    <div className="gallery-page animate-fade-in">
      <header className="gallery-hero">
        <div className="container">
          <h1>
            OUR <span className="text-neon">GALLERY</span>
          </h1>
          <p className="text-secondary">
            Take a look at our gym areas, premium equipment, and training spaces.
          </p>
        </div>
      </header>

      <main className="container py-8">
        <div className="gallery-grid">
          {GALLERY.map((item) => (
            <figure key={item.src} className="gallery-card card hover-glow">
              <div className="gallery-img-wrap">
                <img src={item.src} alt={item.alt} loading="lazy" />
                <span className="gallery-tag">{item.tag}</span>
              </div>
              <figcaption className="gallery-caption text-secondary">{item.alt}</figcaption>
            </figure>
          ))}
        </div>
      </main>
    </div>
  );
}

