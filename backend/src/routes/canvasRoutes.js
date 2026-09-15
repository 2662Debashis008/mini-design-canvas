const express = require('express');
const router = express.Router();
const {
  getCanvases,
  getCanvasById,
  createCanvas,
  updateCanvas,
  deleteCanvas
} = require('../controllers/canvasController');
const {
  validateCreateCanvas,
  validateUpdateCanvas
} = require('../validators/canvasValidator');
const { optionalAuth } = require('../middleware/authMiddleware');

// Attach optional user context if token provided
router.use(optionalAuth);

router
  .route('/')
  .get(getCanvases)
  .post(validateCreateCanvas, createCanvas);

router
  .route('/:id')
  .get(getCanvasById)
  .put(validateUpdateCanvas, updateCanvas)
  .delete(deleteCanvas);

module.exports = router;
