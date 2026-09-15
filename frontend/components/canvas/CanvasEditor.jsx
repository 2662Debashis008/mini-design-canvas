'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Header from '../common/Header';
import CanvasToolbar from './CanvasToolbar';
import PropertiesPanel from './PropertiesPanel';
import LayersPanel from './LayersPanel';
import Loader from '../common/Loader';
import { updateCanvas } from '../../services/canvasApi';
import { SAVE_STATUS } from '../../utils/constants';
import {
  createRectangle,
  createCircle,
  createText
} from '../../utils/shapeFactory';

// Dynamically import CanvasStage with SSR disabled because Konva requires browser DOM Canvas
const CanvasStage = dynamic(() => import('./CanvasStage'), {
  ssr: false,
  loading: () => <Loader text="Loading canvas workspace..." />
});

export default function CanvasEditor({ initialCanvas }) {
  const [canvas, setCanvas] = useState(initialCanvas);
  const [elements, setElements] = useState(initialCanvas?.elements || []);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [saveStatus, setSaveStatus] = useState(SAVE_STATUS.SAVED);

  // Undo / Redo History Stack
  const [history, setHistory] = useState([initialCanvas?.elements || []]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const stageRef = useRef(null);
  const isInitialMount = useRef(true);

  // Push new state to undo/redo history
  const pushToHistory = useCallback(
    (newElements) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, newElements];
      });
      setHistoryIndex((prev) => prev + 1);
      setSaveStatus(SAVE_STATUS.UNSAVED);
    },
    [historyIndex]
  );

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const targetElements = history[targetIndex];
      setHistoryIndex(targetIndex);
      setElements(targetElements);
      setSaveStatus(SAVE_STATUS.UNSAVED);
      // If selected element no longer exists, deselect
      if (!targetElements.some((el) => el.elementId === selectedElementId)) {
        setSelectedElementId(null);
        setSelectedNode(null);
      }
    }
  }, [historyIndex, history, selectedElementId]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const targetElements = history[targetIndex];
      setHistoryIndex(targetIndex);
      setElements(targetElements);
      setSaveStatus(SAVE_STATUS.UNSAVED);
      if (!targetElements.some((el) => el.elementId === selectedElementId)) {
        setSelectedElementId(null);
        setSelectedNode(null);
      }
    }
  }, [historyIndex, history, selectedElementId]);

  // Save changes to backend MongoDB
  const handleSave = useCallback(async () => {
    if (!canvas?._id) return;

    try {
      setSaveStatus(SAVE_STATUS.SAVING);
      const updated = await updateCanvas(canvas._id, {
        name: canvas.name,
        width: canvas.width,
        height: canvas.height,
        elements
      });
      setCanvas(updated);
      setSaveStatus(SAVE_STATUS.SAVED);
    } catch (err) {
      console.error('Failed to save canvas:', err);
      setSaveStatus(SAVE_STATUS.ERROR);
    }
  }, [canvas, elements]);

  // Debounced Autosave (triggers 2.5s after editing stops if unsaved)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (saveStatus !== SAVE_STATUS.UNSAVED) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 2500);

    return () => clearTimeout(timer);
  }, [elements, saveStatus, handleSave]);

  // Selection Handler
  const handleSelectElement = useCallback((id, node) => {
    setSelectedElementId(id);
    setSelectedNode(node);
  }, []);

  // Update single element attributes
  const handleUpdateElement = useCallback(
    (id, updates) => {
      setElements((prev) => {
        const next = prev.map((el) => {
          if (el.elementId === id) {
            return { ...el, ...updates };
          }
          return el;
        });
        pushToHistory(next);
        return next;
      });
    },
    [pushToHistory]
  );

  // Add new Rectangle
  const handleAddRectangle = useCallback(() => {
    const newRect = createRectangle({
      x: Math.round(canvas.width / 2 - 80),
      y: Math.round(canvas.height / 2 - 50)
    });
    const next = [...elements, newRect];
    setElements(next);
    pushToHistory(next);
    setSelectedElementId(newRect.elementId);
  }, [canvas.width, canvas.height, elements, pushToHistory]);

  // Add new Circle
  const handleAddCircle = useCallback(() => {
    const newCircle = createCircle({
      x: Math.round(canvas.width / 2 - 60),
      y: Math.round(canvas.height / 2 - 60)
    });
    const next = [...elements, newCircle];
    setElements(next);
    pushToHistory(next);
    setSelectedElementId(newCircle.elementId);
  }, [canvas.width, canvas.height, elements, pushToHistory]);

  // Add new Text
  const handleAddText = useCallback(() => {
    const newText = createText({
      x: Math.round(canvas.width / 2 - 100),
      y: Math.round(canvas.height / 2 - 20)
    });
    const next = [...elements, newText];
    setElements(next);
    pushToHistory(next);
    setSelectedElementId(newText.elementId);
  }, [canvas.width, canvas.height, elements, pushToHistory]);

  // Delete selected element
  const handleDeleteSelected = useCallback(() => {
    if (!selectedElementId) return;

    const next = elements.filter((el) => el.elementId !== selectedElementId);
    setElements(next);
    pushToHistory(next);
    setSelectedElementId(null);
    setSelectedNode(null);
  }, [selectedElementId, elements, pushToHistory]);

  // Delete element by ID (e.g. from Layers panel)
  const handleDeleteElementById = useCallback(
    (id) => {
      const next = elements.filter((el) => el.elementId !== id);
      setElements(next);
      pushToHistory(next);
      if (selectedElementId === id) {
        setSelectedElementId(null);
        setSelectedNode(null);
      }
    },
    [elements, pushToHistory, selectedElementId]
  );

  // Reorder elements (Layers panel)
  const handleReorderElements = useCallback(
    (reordered) => {
      setElements(reordered);
      pushToHistory(reordered);
    },
    [pushToHistory]
  );

  // Export Stage to PNG synchronously within user click event context
  const handleExportPng = useCallback(() => {
    if (!stageRef.current) return;

    try {
      const stage = stageRef.current;

      // 1. Temporarily hide transformer so handles are not included in the image
      const transformers = stage.find('Transformer');
      transformers.forEach((tr) => tr.hide());
      stage.batchDraw();

      // 2. Generate PNG data URL synchronously with explicit MIME type and 2x pixel ratio
      const dataUrl = stage.toDataURL({
        mimeType: 'image/png',
        pixelRatio: 2,
        quality: 1
      });

      // 3. Immediately restore transformer
      transformers.forEach((tr) => tr.show());
      stage.batchDraw();

      // 4. Sanitize project name and enforce .png extension
      let baseName = (canvas?.name || 'canvas').trim();
      baseName = baseName.replace(/\.png$/i, '');
      baseName = baseName.replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'canvas';
      const fileName = `${baseName}.png`;

      // 5. Trigger direct download synchronously in the user click context
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export PNG:', err);
    }
  }, [canvas?.name]);

  // Keyboard controls (Delete, Backspace, Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept delete or shortcuts when editing an input or textarea
      const targetTag = e.target.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') {
        return;
      }

      // Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          e.preventDefault();
          handleDeleteSelected();
        }
      }

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }

      // Quick tool shortcuts (V for select, R for rect, C for circle, T for text)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key.toLowerCase() === 'v') setActiveTool('select');
        if (e.key.toLowerCase() === 'r') handleAddRectangle();
        if (e.key.toLowerCase() === 'c') handleAddCircle();
        if (e.key.toLowerCase() === 't') handleAddText();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedElementId,
    handleDeleteSelected,
    handleUndo,
    handleRedo,
    handleAddRectangle,
    handleAddCircle,
    handleAddText
  ]);

  const selectedElement = elements.find((el) => el.elementId === selectedElementId) || null;

  return (
    <div className="editor-container">
      {/* Top Header */}
      <Header
        isEditor
        canvasName={canvas?.name}
        saveStatus={saveStatus}
        onSave={handleSave}
        onExportPng={handleExportPng}
      />

      <div className="editor-body">
        {/* Left Toolbar */}
        <CanvasToolbar
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          onAddRectangle={handleAddRectangle}
          onAddCircle={handleAddCircle}
          onAddText={handleAddText}
          onDeleteSelected={handleDeleteSelected}
          canDelete={Boolean(selectedElementId)}
          onUndo={handleUndo}
          canUndo={historyIndex > 0}
          onRedo={handleRedo}
          canRedo={historyIndex < history.length - 1}
          onExportPng={handleExportPng}
        />

        {/* Center Workspace Stage */}
        <CanvasStage
          canvas={canvas}
          elements={elements}
          selectedElementId={selectedElementId}
          selectedNode={selectedNode}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
          stageRef={stageRef}
        />

        {/* Right Sidebar: Properties and Layers */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '280px' }}>
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
          />
          <LayersPanel
            elements={elements}
            selectedElementId={selectedElementId}
            onSelectElement={(id) => handleSelectElement(id, null)}
            onReorderElements={handleReorderElements}
            onDeleteElement={handleDeleteElementById}
          />
        </div>
      </div>
    </div>
  );
}
