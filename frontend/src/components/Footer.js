import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3>IRON<span className="text-neon">CORE</span></h3>
          <p className="footer-desc">
            Premium fitness facility dedicated to helping you achieve your ultimate physical potential.
          </p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/classes">Classes</Link></li>
            <li><Link href="/trainers">Trainers</Link></li>
            <li><Link href="/memberships">Memberships</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/blog">Blog</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>123 Fitness Street, NY 10001</p>
          <p>info@ironcore.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} IronCore Fitness. All rights reserved.</p>
      </div>
    </footer>
  );
}
