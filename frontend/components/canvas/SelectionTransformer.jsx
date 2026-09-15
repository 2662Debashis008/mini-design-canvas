'use client';

import { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';

export default function SelectionTransformer({ selectedNode }) {
  const trRef = useRef(null);

  useEffect(() => {
    if (!trRef.current) return;

    if (selectedNode) {
      // Attach transformer to selected node
      trRef.current.nodes([selectedNode]);
      trRef.current.getLayer()?.batchDraw();
    } else {
      // Detach
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedNode]);

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        // Enforce minimum shape dimensions
        if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
          return oldBox;
        }
        return newBox;
      }}
      enabledAnchors={[
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'middle-left',
        'middle-right',
        'top-center',
        'bottom-center'
      ]}
      anchorCornerRadius={2}
      anchorSize={8}
      anchorStroke="#2563eb"
      anchorFill="#ffffff"
      borderStroke="#2563eb"
      borderDash={[3, 3]}
      rotateAnchorOffset={24}
    />
  );
}
