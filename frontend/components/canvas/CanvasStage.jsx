'use client';

import { Stage, Layer, Rect } from 'react-konva';
import ShapeRenderer from './ShapeRenderer';
import SelectionTransformer from './SelectionTransformer';

export default function CanvasStage({
  canvas,
  elements,
  selectedElementId,
  selectedNode,
  onSelectElement,
  onUpdateElement,
  stageRef
}) {
  const width = canvas?.width || 900;
  const height = canvas?.height || 600;

  const handleStageMouseDown = (e) => {
    // If clicked directly on the stage or canvas background rect, deselect current shape
    const clickedOnStage = e.target === e.target.getStage() || e.target.name() === 'canvas-bg';
    if (clickedOnStage) {
      onSelectElement(null, null);
    }
  };

  return (
    <div className="canvas-workspace">
      <div
        className="stage-wrapper"
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
      >
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseDown={handleStageMouseDown}
          onTouchStart={handleStageMouseDown}
        >
          <Layer>
            {/* Base white background of the canvas */}
            <Rect
              name="canvas-bg"
              x={0}
              y={0}
              width={width}
              height={height}
              fill="#ffffff"
              listening={true}
            />

            {/* Elements */}
            {elements.map((el) => (
              <ShapeRenderer
                key={el.elementId}
                element={el}
                isSelected={el.elementId === selectedElementId}
                onSelect={onSelectElement}
                onUpdate={onUpdateElement}
              />
            ))}

            {/* Transformer */}
            <SelectionTransformer selectedNode={selectedNode} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
