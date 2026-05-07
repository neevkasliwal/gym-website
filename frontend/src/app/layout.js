import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'IronCore Fitness | Premium Gym Experience',
  description: 'Join IronCore Fitness and unlock your ultimate physical potential. Premium equipment, expert trainers, and dynamic classes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
