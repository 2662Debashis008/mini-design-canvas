'use client';

import {
  MousePointer,
  Square,
  Circle,
  Type,
  Trash2,
  Undo2,
  Redo2,
  Download
} from 'lucide-react';

export default function CanvasToolbar({
  activeTool = 'select',
  onSelectTool,
  onAddRectangle,
  onAddCircle,
  onAddText,
  onDeleteSelected,
  canDelete = false,
  onUndo,
  canUndo = false,
  onRedo,
  canRedo = false,
  onExportPng
}) {
  return (
    <aside className="editor-toolbar" aria-label="Editor Toolbar">
      <button
        type="button"
        className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`}
        onClick={() => onSelectTool('select')}
        title="Select Tool (V)"
      >
        <MousePointer size={18} />
      </button>

      <div className="toolbar-divider" />

      <button
        type="button"
        className="tool-btn"
        onClick={onAddRectangle}
        title="Add Rectangle (R)"
      >
        <Square size={18} />
      </button>

      <button
        type="button"
        className="tool-btn"
        onClick={onAddCircle}
        title="Add Circle (C)"
      >
        <Circle size={18} />
      </button>

      <button
        type="button"
        className="tool-btn"
        onClick={onAddText}
        title="Add Text (T)"
      >
        <Type size={18} />
      </button>

      <div className="toolbar-divider" />

      <button
        type="button"
        className="tool-btn"
        onClick={onDeleteSelected}
        disabled={!canDelete}
        title="Delete Selected Shape (Del/Backspace)"
        style={{ color: canDelete ? 'var(--danger)' : undefined }}
      >
        <Trash2 size={18} />
      </button>

      <div className="toolbar-divider" />

      <button
        type="button"
        className="tool-btn"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={18} />
      </button>

      <button
        type="button"
        className="tool-btn"
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
      >
        <Redo2 size={18} />
      </button>

      <div className="toolbar-divider" />

      <button
        type="button"
        className="tool-btn"
        onClick={onExportPng}
        title="Download Canvas as PNG"
      >
        <Download size={18} />
      </button>
    </aside>
  );
}
