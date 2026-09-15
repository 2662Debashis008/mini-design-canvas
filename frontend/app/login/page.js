'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="dashboard-container" style={{ maxWidth: '440px', marginTop: '2rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', gap: '0.4rem' }}>
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="modal-content" style={{ maxWidth: '100%', border: '1px solid var(--border-subtle)' }}>
          <div className="modal-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Log In to Glazia Canvas</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Access your saved design projects and continue editing.
          </p>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="modal-actions" style={{ flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                style={{ width: '100%' }}
              >
                <LogIn size={15} />
                <span>{loading ? 'Logging in...' : 'Log In'}</span>
              </Button>

              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Don&apos;t have an account?{' '}
                <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Create an account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
