'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { createCanvas } from '../../services/canvasApi';
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from '../../utils/constants';

export default function NewCanvasPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [width, setWidth] = useState(DEFAULT_CANVAS_WIDTH);
  const [height, setHeight] = useState(DEFAULT_CANVAS_HEIGHT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a canvas name.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newCanvas = await createCanvas({
        name: name.trim(),
        width: Number(width) || DEFAULT_CANVAS_WIDTH,
        height: Number(height) || DEFAULT_CANVAS_HEIGHT,
        elements: []
      });

      // Redirect to the newly created canvas editor
      router.push(`/canvas/${newCanvas._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create canvas.');
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="dashboard-container" style={{ maxWidth: '520px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', gap: '0.4rem' }}>
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="modal-content" style={{ maxWidth: '100%', border: '1px solid var(--border-subtle)' }}>
          <div className="modal-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create New Canvas</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Configure the name and dimensions for your new design workspace.
          </p>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="canvas-name">Canvas Name *</label>
              <input
                id="canvas-name"
                type="text"
                className="form-input"
                placeholder="e.g. Marketing Banner, Social Post"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="prop-grid-2">
              <div className="form-group">
                <label htmlFor="canvas-width">Width (px)</label>
                <input
                  id="canvas-width"
                  type="number"
                  min="200"
                  max="2400"
                  className="form-input"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="canvas-height">Height (px)</label>
                <input
                  id="canvas-height"
                  type="number"
                  min="200"
                  max="2400"
                  className="form-input"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <Link href="/">
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Link>
              <Button variant="primary" type="submit" disabled={loading}>
                <Sparkles size={15} />
                <span>{loading ? 'Creating...' : 'Create & Open Canvas'}</span>
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
