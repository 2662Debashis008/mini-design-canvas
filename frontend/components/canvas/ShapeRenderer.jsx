'use client';

import { useRef, useEffect } from 'react';
import { Rect, Circle, Text } from 'react-konva';
import { SHAPE_TYPES } from '../../utils/constants';

export default function ShapeRenderer({
  element,
  isSelected,
  onSelect,
  onUpdate
}) {
  const shapeRef = useRef(null);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      onSelect(element.elementId, shapeRef.current);
    }
  }, [isSelected, element.elementId, onSelect]);

  const handleDragEnd = (e) => {
    const node = e.target;
    onUpdate(element.elementId, {
      x: Math.round(node.x()),
      y: Math.round(node.y())
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scales back to 1 to avoid compounded scaling
    node.scaleX(1);
    node.scaleY(1);

    const rotation = Math.round(node.rotation() % 360);
    const newX = Math.round(node.x());
    const newY = Math.round(node.y());

    if (element.type === SHAPE_TYPES.CIRCLE) {
      // For circle, keep diameter proportional
      const avgScale = Math.max(0.1, (Math.abs(scaleX) + Math.abs(scaleY)) / 2);
      const newDiameter = Math.max(15, Math.round(element.width * avgScale));

      onUpdate(element.elementId, {
        x: newX,
        y: newY,
        width: newDiameter,
        height: newDiameter,
        rotation
      });
    } else {
      // Rectangle or Text
      const newWidth = Math.max(20, Math.round(element.width * scaleX));
      const newHeight = Math.max(15, Math.round(element.height * scaleY));

      onUpdate(element.elementId, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        rotation
      });
    }
  };

  const handleClick = (e) => {
    e.cancelBubble = true; // Prevent stage click from deselecting
    onSelect(element.elementId, shapeRef.current);
  };

  // 1. RECTANGLE
  if (element.type === SHAPE_TYPES.RECTANGLE) {
    return (
      <Rect
        ref={shapeRef}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation || 0}
        fill={element.fill}
        draggable
        onClick={handleClick}
        onTap={handleClick}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        stroke={isSelected ? '#2563eb' : 'transparent'}
        strokeWidth={1}
      />
    );
  }

  // 2. CIRCLE
  if (element.type === SHAPE_TYPES.CIRCLE) {
    const radius = element.width / 2;
    return (
      <Circle
        ref={shapeRef}
        x={element.x + radius}
        y={element.y + radius}
        radius={radius}
        rotation={element.rotation || 0}
        fill={element.fill}
        draggable
        onClick={handleClick}
        onTap={handleClick}
        onDragEnd={(e) => {
          const node = e.target;
          onUpdate(element.elementId, {
            x: Math.round(node.x() - radius),
            y: Math.round(node.y() - radius)
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          const avgScale = Math.max(0.1, (Math.abs(scaleX) + Math.abs(scaleY)) / 2);
          const newRadius = Math.max(10, Math.round(radius * avgScale));
          const newDiameter = newRadius * 2;
          onUpdate(element.elementId, {
            x: Math.round(node.x() - newRadius),
            y: Math.round(node.y() - newRadius),
            width: newDiameter,
            height: newDiameter,
            rotation: Math.round(node.rotation() % 360)
          });
        }}
        stroke={isSelected ? '#2563eb' : 'transparent'}
        strokeWidth={1}
      />
    );
  }

  // 3. TEXT
  if (element.type === SHAPE_TYPES.TEXT) {
    return (
      <Text
        ref={shapeRef}
        x={element.x}
        y={element.y}
        width={element.width}
        text={element.text || 'Heading'}
        fontSize={element.fontSize || 24}
        fontFamily="sans-serif"
        fill={element.fill}
        rotation={element.rotation || 0}
        draggable
        onClick={handleClick}
        onTap={handleClick}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        stroke={isSelected ? '#2563eb' : 'transparent'}
        strokeWidth={1}
      />
    );
  }

  return null;
}
