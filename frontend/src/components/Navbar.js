'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check auth state
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { setUser(null); }
    }
  }, [pathname]); // re-check on route change

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/classes', label: 'Classes' },
    { href: '/trainers', label: 'Trainers' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/memberships', label: 'Memberships' },
    { href: '/contact', label: 'Contact' },
  ];

  const dashboardPath = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/member';

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link href="/" className="logo" onClick={closeMobileMenu}>
          IRON<span className="text-neon">CORE</span>
        </Link>
        
        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {user?.role !== 'admin' && navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
          
          {user ? (
            <>
              <Link
                href={dashboardPath}
                className="btn btn-outline"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <button className="btn btn-primary" onClick={() => { handleLogout(); closeMobileMenu(); }}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="btn btn-primary" onClick={closeMobileMenu}>
              Join Now
            </Link>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
