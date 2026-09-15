/**
 * Validates request payload for creating or updating a canvas
 */
const validateCanvasInput = (data, isUpdate = false) => {
  const errors = [];

  // Name validation
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Canvas name is required and cannot be empty or only whitespace.');
    }
  }

  // Width validation
  if (data.width !== undefined) {
    if (typeof data.width !== 'number' || isNaN(data.width) || data.width <= 0) {
      errors.push('Width must be a positive number.');
    }
  }

  // Height validation
  if (data.height !== undefined) {
    if (typeof data.height !== 'number' || isNaN(data.height) || data.height <= 0) {
      errors.push('Height must be a positive number.');
    }
  }

  // Elements validation
  if (data.elements !== undefined) {
    if (!Array.isArray(data.elements)) {
      errors.push('Elements must be an array.');
    } else {
      const allowedTypes = ['rectangle', 'circle', 'text'];
      data.elements.forEach((el, index) => {
        if (!el || typeof el !== 'object') {
          errors.push(`Element at index ${index} must be an object.`);
          return;
        }

        if (!el.elementId || typeof el.elementId !== 'string') {
          errors.push(`Element at index ${index} is missing a valid elementId.`);
        }

        if (!el.type || !allowedTypes.includes(el.type)) {
          errors.push(
            `Element at index ${index} has invalid type "${el.type}". Allowed: ${allowedTypes.join(', ')}.`
          );
        }

        // Numeric checks
        const numericProps = ['x', 'y', 'width', 'height', 'rotation', 'fontSize'];
        numericProps.forEach((prop) => {
          if (el[prop] !== undefined && (typeof el[prop] !== 'number' || isNaN(el[prop]))) {
            errors.push(`Element at index ${index} property "${prop}" must be a valid number.`);
          }
        });
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateCreateCanvas = (req, res, next) => {
  const { isValid, errors } = validateCanvasInput(req.body, false);
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  next();
};

const validateUpdateCanvas = (req, res, next) => {
  const { isValid, errors } = validateCanvasInput(req.body, true);
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  next();
};

module.exports = {
  validateCanvasInput,
  validateCreateCanvas,
  validateUpdateCanvas
};
