'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create Your Account</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Sign up to save, organize, and manage your private design canvases.
          </p>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password (min. 6 characters)</label>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="modal-actions" style={{ flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                style={{ width: '100%' }}
              >
                <UserPlus size={15} />
                <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              </Button>

              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Log In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
