'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link href="/" className="logo">
          IRON<span className="text-neon">CORE</span>
        </Link>
        
        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link href="/about">About</Link>
          <Link href="/classes">Classes</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/trainers">Trainers</Link>
          <Link href="/memberships">Memberships</Link>
          <Link href="/auth/login" className="btn btn-primary">Login</Link>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
