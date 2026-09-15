const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Canvas = require('./src/models/Canvas');
const { validateCanvasInput } = require('./src/validators/canvasValidator');

async function testBackend() {
  console.log('Testing MongoDB connection and Canvas Model...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB!');

  // Test 1: Validation
  console.log('\n--- Test 1: Validation ---');
  const invalidName = validateCanvasInput({ name: '   ' });
  console.log('Empty name validation passed (should be false):', !invalidName.isValid);

  const invalidElement = validateCanvasInput({
    name: 'Valid Name',
    elements: [{ elementId: 'el-1', type: 'triangle' }]
  });
  console.log('Invalid element type validation passed (should be false):', !invalidElement.isValid);

  const validData = validateCanvasInput({
    name: 'My Sample Canvas',
    width: 900,
    height: 600,
    elements: [
      {
        elementId: 'rect-1',
        type: 'rectangle',
        x: 50,
        y: 50,
        width: 150,
        height: 100,
        rotation: 0,
        fill: '#3B82F6'
      }
    ]
  });
  console.log('Valid data validation passed (should be true):', validData.isValid);

  // Test 2: Mongoose CRUD
  console.log('\n--- Test 2: Mongoose CRUD ---');
  // Clean up any test canvases
  await Canvas.deleteMany({ name: 'Automated Test Canvas' });

  // Create
  const created = await Canvas.create({
    name: 'Automated Test Canvas',
    width: 900,
    height: 600,
    elements: [
      {
        elementId: 'rect-1',
        type: 'rectangle',
        x: 100,
        y: 100,
        width: 200,
        height: 120,
        rotation: 15,
        fill: '#10B981'
      },
      {
        elementId: 'circle-1',
        type: 'circle',
        x: 350,
        y: 200,
        width: 100,
        height: 100,
        rotation: 0,
        fill: '#EF4444'
      },
      {
        elementId: 'text-1',
        type: 'text',
        x: 200,
        y: 350,
        width: 200,
        height: 50,
        rotation: 0,
        fill: '#1E293B',
        text: 'Hello Konva',
        fontSize: 28
      }
    ]
  });
  console.log('Canvas created in MongoDB with ID:', created._id.toString());

  // Read
  const fetched = await Canvas.findById(created._id);
  console.log('Fetched canvas name:', fetched.name);
  console.log('Fetched elements count:', fetched.elements.length);

  // Update
  fetched.elements[0].x = 150;
  await fetched.save();
  const updated = await Canvas.findById(created._id);
  console.log('Updated element 0 x coordinate:', updated.elements[0].x);

  // Delete
  await Canvas.findByIdAndDelete(created._id);
  const deletedCheck = await Canvas.findById(created._id);
  console.log('Canvas successfully deleted (should be null):', deletedCheck === null);

  await mongoose.disconnect();
  console.log('\nAll backend tests passed successfully!');
}

testBackend().catch((err) => {
  console.error('Backend test failed:', err);
  process.exit(1);
});
