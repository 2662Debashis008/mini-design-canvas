'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Palette } from 'lucide-react';
import CanvasCard from './CanvasCard';
import Button from '../common/Button';

export default function CanvasList({ canvases, onDeleteCanvas }) {
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!selectedForDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteCanvas(selectedForDelete._id);
      setSelectedForDelete(null);
    } catch (err) {
      alert(`Error deleting canvas: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!canvases || canvases.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Palette size={48} />
        </div>
        <h3>No canvases yet</h3>
        <p>Create your first design canvas to get started with Rectangles, Circles, and Text.</p>
        <Link href="/new">
          <Button variant="primary">
            <Plus size={16} />
            <span>Create New Canvas</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="canvas-grid">
        {canvases.map((canvas) => (
          <CanvasCard
            key={canvas._id}
            canvas={canvas}
            onDeleteClick={(c) => setSelectedForDelete(c)}
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      {selectedForDelete && (
        <div className="modal-overlay" onClick={() => setSelectedForDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Canvas</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Are you sure you want to delete &quot;<strong>{selectedForDelete.name}</strong>&quot;? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <Button
                variant="secondary"
                onClick={() => setSelectedForDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
