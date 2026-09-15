import { getToken } from './authApi';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Generic request helper with error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.errors = data?.errors;
    throw error;
  }

  return data;
};

export const getCanvases = async () => {
  const response = await request('/canvases');
  return response.data || [];
};

export const getCanvasById = async (id) => {
  const response = await request(`/canvases/${id}`);
  return response.data;
};

export const createCanvas = async (canvasData) => {
  const response = await request('/canvases', {
    method: 'POST',
    body: JSON.stringify(canvasData)
  });
  return response.data;
};

export const updateCanvas = async (id, canvasData) => {
  const response = await request(`/canvases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(canvasData)
  });
  return response.data;
};

export const deleteCanvas = async (id) => {
  const response = await request(`/canvases/${id}`, {
    method: 'DELETE'
  });
  return response.data;
};
