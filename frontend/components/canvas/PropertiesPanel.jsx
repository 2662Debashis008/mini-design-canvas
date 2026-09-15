'use client';

import { DEFAULT_COLORS, SHAPE_TYPES } from '../../utils/constants';

export default function PropertiesPanel({ selectedElement, onUpdateElement }) {
  if (!selectedElement) {
    return (
      <div className="editor-sidebar">
        <div className="panel-header">
          <span>Properties</span>
        </div>
        <div className="panel-section" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Select an element to edit its properties.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (prop, value) => {
    onUpdateElement(selectedElement.elementId, { [prop]: value });
  };

  const handleNumberChange = (prop, value) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      handleChange(prop, num);
    }
  };

  const isText = selectedElement.type === SHAPE_TYPES.TEXT;
  const isCircle = selectedElement.type === SHAPE_TYPES.CIRCLE;

  return (
    <div className="editor-sidebar">
      <div className="panel-header">
        <span>
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
        </span>
      </div>

      {/* Position & Geometry */}
      <div className="panel-section">
        <div className="section-title">Position & Size</div>

        <div className="prop-grid-2">
          <div className="form-group">
            <label htmlFor="prop-x">X (px)</label>
            <input
              id="prop-x"
              type="number"
              className="form-input"
              value={selectedElement.x ?? 0}
              onChange={(e) => handleNumberChange('x', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="prop-y">Y (px)</label>
            <input
              id="prop-y"
              type="number"
              className="form-input"
              value={selectedElement.y ?? 0}
              onChange={(e) => handleNumberChange('y', e.target.value)}
            />
          </div>
        </div>

        <div className="prop-grid-2">
          <div className="form-group">
            <label htmlFor="prop-w">{isCircle ? 'Diameter' : 'Width'} (px)</label>
            <input
              id="prop-w"
              type="number"
              min="10"
              className="form-input"
              value={selectedElement.width ?? 0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val > 0) {
                  if (isCircle) {
                    onUpdateElement(selectedElement.elementId, {
                      width: val,
                      height: val
                    });
                  } else {
                    handleChange('width', val);
                  }
                }
              }}
            />
          </div>
          {!isCircle && (
            <div className="form-group">
              <label htmlFor="prop-h">Height (px)</label>
              <input
                id="prop-h"
                type="number"
                min="10"
                className="form-input"
                value={selectedElement.height ?? 0}
                onChange={(e) => handleNumberChange('height', e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="prop-rot">Rotation (deg)</label>
          <input
            id="prop-rot"
            type="number"
            className="form-input"
            value={selectedElement.rotation ?? 0}
            onChange={(e) => handleNumberChange('rotation', e.target.value)}
          />
        </div>
      </div>

      {/* Text Specific Settings */}
      {isText && (
        <div className="panel-section">
          <div className="section-title">Typography</div>

          <div className="form-group">
            <label htmlFor="prop-text-content">Content</label>
            <textarea
              id="prop-text-content"
              rows={3}
              className="form-input"
              value={selectedElement.text ?? ''}
              onChange={(e) => handleChange('text', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prop-text-size">Font Size (px)</label>
            <input
              id="prop-text-size"
              type="number"
              min="8"
              max="160"
              className="form-input"
              value={selectedElement.fontSize ?? 24}
              onChange={(e) => handleNumberChange('fontSize', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Color / Fill */}
      <div className="panel-section">
        <div className="section-title">{isText ? 'Text Color' : 'Fill Color'}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            id="prop-color-picker"
            type="color"
            value={selectedElement.fill || '#3b82f6'}
            onChange={(e) => handleChange('fill', e.target.value)}
            style={{
              width: '36px',
              height: '36px',
              padding: '0',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)'
            }}
          />
          <input
            type="text"
            className="form-input"
            value={selectedElement.fill || '#3b82f6'}
            onChange={(e) => handleChange('fill', e.target.value)}
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <div className="color-palette">
          {DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-swatch ${selectedElement.fill === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleChange('fill', color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
