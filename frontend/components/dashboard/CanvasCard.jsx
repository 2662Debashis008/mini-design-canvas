'use client';

import Link from 'next/link';
import { Edit3, Trash2, Calendar, Shapes } from 'lucide-react';
import Button from '../common/Button';

export default function CanvasCard({ canvas, onDeleteClick }) {
  const formattedDate = new Date(canvas.updatedAt || canvas.createdAt).toLocaleDateString(
    undefined,
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  );

  const elementCount = canvas.elements?.length || 0;

  return (
    <div className="canvas-card">
      <div className="canvas-preview-placeholder">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Shapes size={20} />
          <span>{elementCount} element{elementCount === 1 ? '' : 's'}</span>
        </div>
      </div>

      <div className="canvas-card-body">
        <h3 className="canvas-card-title" title={canvas.name}>
          {canvas.name}
        </h3>

        <div className="canvas-card-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} />
            {formattedDate}
          </span>
          <span style={{ marginLeft: '0.6rem' }}>
            {canvas.width} × {canvas.height}px
          </span>
        </div>

        <div className="canvas-card-actions">
          <Link href={`/canvas/${canvas._id}`} style={{ flex: 1 }}>
            <Button variant="primary" size="sm" style={{ width: '100%' }}>
              <Edit3 size={14} />
              <span>Open Editor</span>
            </Button>
          </Link>

          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeleteClick(canvas)}
            title="Delete canvas"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
