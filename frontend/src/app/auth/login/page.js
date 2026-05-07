'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../services/api';
import '../auth.css';

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      if (isAdmin && !adminKey) {
        throw new Error('Admin key is required');
      }

      // API call
      const res = await authAPI.login({
        email,
        password,
        role: isAdmin ? 'admin' : 'member',
        adminKey: isAdmin ? adminKey : undefined
      });

      // Save token
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));

      // Routing
      if (res.user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/member');
      }

    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container container animate-fade-in">
      <div className="card auth-card">
        <div className="text-center mb-8">
          <h2><span className="text-neon">{isAdmin ? 'Admin' : 'Member'}</span> Login</h2>
          <p className="text-secondary">Welcome back to IronCore</p>
        </div>

        <div className="auth-toggle mb-8">
          <button 
            className={`toggle-btn ${!isAdmin ? 'active' : ''}`}
            onClick={() => setIsAdmin(false)}
            type="button"
          >
            Member
          </button>
          <button 
            className={`toggle-btn ${isAdmin ? 'active' : ''}`}
            onClick={() => setIsAdmin(true)}
            type="button"
          >
            Admin
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {isAdmin && (
            <div className="input-group">
              <label htmlFor="adminKey">Admin Secret Key</label>
              <input 
                type="password" 
                id="adminKey" 
                className="input-field" 
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required 
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mt-4">Login</button>
        </form>

        <div className="auth-footer mt-8 text-center">
          <p className="text-secondary">
            Don't have an account? <Link href="/auth/register" className="text-neon">Register</Link>
          </p>
          <p className="text-secondary mt-2">
            <Link href="/auth/forgot-password">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
