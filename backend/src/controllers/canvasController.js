const Canvas = require('../models/Canvas');

// @desc    Get all canvases (user-scoped if logged in, or guest if not)
// @route   GET /api/canvases
// @access  Public / Optional Auth
const getCanvases = async (req, res, next) => {
  try {
    const filter = req.user ? { user: req.user._id } : { user: null };

    const canvases = await Canvas.find(filter)
      .select('name width height elements createdAt updatedAt user')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: canvases.length,
      data: canvases
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single canvas by ID
// @route   GET /api/canvases/:id
// @access  Public
const getCanvasById = async (req, res, next) => {
  try {
    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: `Canvas not found with id: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: canvas
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new canvas
// @route   POST /api/canvases
// @access  Public / Optional Auth
const createCanvas = async (req, res, next) => {
  try {
    const { name, width = 900, height = 600, elements = [] } = req.body;

    const newCanvas = await Canvas.create({
      name: name.trim(),
      width,
      height,
      elements,
      user: req.user ? req.user._id : null
    });

    res.status(201).json({
      success: true,
      data: newCanvas
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing canvas
// @route   PUT /api/canvases/:id
// @access  Public / Optional Auth
const updateCanvas = async (req, res, next) => {
  try {
    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: `Canvas not found with id: ${req.params.id}`
      });
    }

    // If canvas has an owner and user is authenticated, ensure matching ownership
    if (canvas.user && req.user && canvas.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this canvas'
      });
    }

    const { name, width, height, elements } = req.body;
    if (name !== undefined) canvas.name = name.trim();
    if (width !== undefined) canvas.width = width;
    if (height !== undefined) canvas.height = height;
    if (elements !== undefined) canvas.elements = elements;

    // If canvas was created by a guest and now updated by logged in user, assign ownership
    if (!canvas.user && req.user) {
      canvas.user = req.user._id;
    }

    const updatedCanvas = await canvas.save();

    res.status(200).json({
      success: true,
      data: updatedCanvas
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a canvas by ID
// @route   DELETE /api/canvases/:id
// @access  Public / Optional Auth
const deleteCanvas = async (req, res, next) => {
  try {
    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({
        success: false,
        message: `Canvas not found with id: ${req.params.id}`
      });
    }

    // If canvas has an owner and user is authenticated, ensure matching ownership
    if (canvas.user && req.user && canvas.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this canvas'
      });
    }

    await Canvas.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Canvas deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCanvases,
  getCanvasById,
  createCanvas,
  updateCanvas,
  deleteCanvas
};
