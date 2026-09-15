import { SHAPE_TYPES } from './constants';

const generateId = (prefix) => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export const createRectangle = (options = {}) => {
  return {
    elementId: generateId('rect'),
    type: SHAPE_TYPES.RECTANGLE,
    x: options.x ?? 100,
    y: options.y ?? 100,
    width: options.width ?? 160,
    height: options.height ?? 100,
    rotation: options.rotation ?? 0,
    fill: options.fill ?? '#3B82F6',
    text: '',
    fontSize: 16
  };
};

export const createCircle = (options = {}) => {
  return {
    elementId: generateId('circle'),
    type: SHAPE_TYPES.CIRCLE,
    x: options.x ?? 200,
    y: options.y ?? 150,
    width: options.width ?? 120,
    height: options.height ?? 120,
    rotation: options.rotation ?? 0,
    fill: options.fill ?? '#10B981',
    text: '',
    fontSize: 16
  };
};

export const createText = (options = {}) => {
  return {
    elementId: generateId('text'),
    type: SHAPE_TYPES.TEXT,
    x: options.x ?? 150,
    y: options.y ?? 250,
    width: options.width ?? 220,
    height: options.height ?? 40,
    rotation: options.rotation ?? 0,
    fill: options.fill ?? '#1E293B',
    text: options.text ?? 'Heading Text',
    fontSize: options.fontSize ?? 28
  };
};
