'use client';

import {
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Trash2,
  Layers,
  Square,
  Circle,
  Type
} from 'lucide-react';
import { SHAPE_TYPES } from '../../utils/constants';

export default function LayersPanel({
  elements = [],
  selectedElementId,
  onSelectElement,
  onReorderElements,
  onDeleteElement
}) {
  const moveLayer = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= elements.length) return;

    const updated = [...elements];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    onReorderElements(updated);
  };

  const moveToFront = (index) => {
    if (index >= elements.length - 1) return;
    const updated = [...elements];
    const [item] = updated.splice(index, 1);
    updated.push(item);
    onReorderElements(updated);
  };

  const moveToBack = (index) => {
    if (index <= 0) return;
    const updated = [...elements];
    const [item] = updated.splice(index, 1);
    updated.unshift(item);
    onReorderElements(updated);
  };

  const getShapeIcon = (type) => {
    if (type === SHAPE_TYPES.RECTANGLE) return <Square size={13} />;
    if (type === SHAPE_TYPES.CIRCLE) return <Circle size={13} />;
    if (type === SHAPE_TYPES.TEXT) return <Type size={13} />;
    return null;
  };

  const getElementLabel = (el) => {
    if (el.type === SHAPE_TYPES.TEXT) {
      return el.text ? `"${el.text.slice(0, 12)}"` : 'Text';
    }
    if (el.type === SHAPE_TYPES.RECTANGLE) {
      return `Rect ${el.width}×${el.height}`;
    }
    if (el.type === SHAPE_TYPES.CIRCLE) {
      return `Circle d:${el.width}`;
    }
    return el.type;
  };

  return (
    <div className="editor-sidebar" style={{ borderTop: '1px solid var(--border-subtle)', height: 'auto' }}>
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Layers size={16} />
          <span>Layer Management ({elements.length})</span>
        </div>
      </div>

      <div className="panel-section">
        {elements.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textAlign: 'center' }}>
            No shapes on canvas
          </p>
        ) : (
          <div className="layers-list">
            {/* Show top-most layer at top of UI list (reverse render of canvas array) */}
            {[...elements].reverse().map((el, revIndex) => {
              const actualIndex = elements.length - 1 - revIndex;
              const isSelected = el.elementId === selectedElementId;

              return (
                <div
                  key={el.elementId}
                  className={`layer-item ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectElement(el.elementId, null)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '120px'
                    }}
                  >
                    <span style={{ color: el.fill || '#64748b' }}>
                      {getShapeIcon(el.type)}
                    </span>
                    <span>{getElementLabel(el)}</span>
                  </div>

                  <div className="layer-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="layer-btn"
                      disabled={actualIndex >= elements.length - 1}
                      onClick={() => moveToFront(actualIndex)}
                      title="Bring to Front"
                    >
                      <ChevronsUp size={13} />
                    </button>
                    <button
                      type="button"
                      className="layer-btn"
                      disabled={actualIndex >= elements.length - 1}
                      onClick={() => moveLayer(actualIndex, 1)}
                      title="Bring Forward"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      className="layer-btn"
                      disabled={actualIndex <= 0}
                      onClick={() => moveLayer(actualIndex, -1)}
                      title="Send Backward"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      className="layer-btn"
                      disabled={actualIndex <= 0}
                      onClick={() => moveToBack(actualIndex)}
                      title="Send to Back"
                    >
                      <ChevronsDown size={13} />
                    </button>
                    <button
                      type="button"
                      className="layer-btn"
                      onClick={() => onDeleteElement(el.elementId)}
                      title="Delete Element"
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
