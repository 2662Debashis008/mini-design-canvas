'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import CanvasList from '../components/dashboard/CanvasList';
import { getCanvases, deleteCanvas } from '../services/canvasApi';

import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [canvases, setCanvases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCanvases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCanvases();
      setCanvases(data);
    } catch (err) {
      setError(err.message || 'Failed to load canvases from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCanvases();
  }, [fetchCanvases, user]);

  const handleDeleteCanvas = async (id) => {
    await deleteCanvas(id);
    setCanvases((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div>
      <Header />
      <main className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Mini Design Canvas</h1>
            <p>Create, customize, and manage your vector design canvases</p>
          </div>
          <Link href="/new">
            <Button variant="primary">
              <Plus size={16} />
              <span>Create New Canvas</span>
            </Button>
          </Link>
        </div>

        {error && <ErrorMessage message={error} onRetry={fetchCanvases} />}

        {loading ? (
          <Loader text="Loading your saved canvases..." />
        ) : (
          <CanvasList canvases={canvases} onDeleteCanvas={handleDeleteCanvas} />
        )}
      </main>
    </div>
  );
}
