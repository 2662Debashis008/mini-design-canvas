'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CanvasEditor from '../../../components/canvas/CanvasEditor';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import { getCanvasById } from '../../../services/canvasApi';

export default function CanvasEditorPage() {
  const params = useParams();
  const canvasId = params?.id;

  const [canvas, setCanvas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCanvas = useCallback(async () => {
    if (!canvasId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getCanvasById(canvasId);
      setCanvas(data);
    } catch (err) {
      setError(err.message || 'Unable to load canvas.');
    } finally {
      setLoading(false);
    }
  }, [canvasId]);

  useEffect(() => {
    fetchCanvas();
  }, [fetchCanvas]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader text="Loading your design canvas..." />
      </div>
    );
  }

  if (error || !canvas) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <ErrorMessage message={error || 'Canvas not found'} onRetry={fetchCanvas} />
        <Link href="/" style={{ marginTop: '1rem' }}>
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return <CanvasEditor initialCanvas={canvas} />;
}
