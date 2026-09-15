const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema(
  {
    elementId: {
      type: String,
      required: [true, 'elementId is required']
    },
    type: {
      type: String,
      required: [true, 'Element type is required'],
      enum: {
        values: ['rectangle', 'circle', 'text'],
        message: '{VALUE} is not a supported element type'
      }
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    rotation: {
      type: Number,
      default: 0
    },
    fill: {
      type: String,
      default: '#3B82F6'
    },
    text: {
      type: String,
      default: 'Heading'
    },
    fontSize: {
      type: Number,
      default: 24
    }
  },
  { _id: false }
);

const canvasSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Canvas name is required'],
      trim: true,
      minlength: [1, 'Canvas name cannot be empty']
    },
    width: {
      type: Number,
      required: [true, 'Canvas width is required'],
      min: [100, 'Canvas width must be at least 100px'],
      default: 900
    },
    height: {
      type: Number,
      required: [true, 'Canvas height is required'],
      min: [100, 'Canvas height must be at least 100px'],
      default: 600
    },
    elements: {
      type: [elementSchema],
      default: []
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Canvas = mongoose.model('Canvas', canvasSchema);

module.exports = Canvas;
