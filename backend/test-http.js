const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const app = require('./src/app');

async function testHttpEndpoints() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for HTTP tests');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));
  const baseUrl = 'http://127.0.0.1:5099';

  console.log('HTTP Test Server running at ' + baseUrl);

  try {
    // 1. GET /api/health
    const resHealth = await fetch(`${baseUrl}/api/health`).then((r) => r.json());
    console.log('Health check:', resHealth.status === 'ok' ? 'PASS' : 'FAIL');

    // 2. POST /api/canvases with validation error (empty name)
    const resBadPost = await fetch(`${baseUrl}/api/canvases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '   ' })
    });
    console.log('Empty name rejected with 400:', resBadPost.status === 400 ? 'PASS' : 'FAIL');

    // 3. POST /api/canvases valid creation
    const resCreate = await fetch(`${baseUrl}/api/canvases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'HTTP Test Canvas',
        width: 900,
        height: 600,
        elements: []
      })
    });
    const createdJson = await resCreate.json();
    console.log('Canvas created with 201:', resCreate.status === 201 ? 'PASS' : 'FAIL');
    const canvasId = createdJson.data._id;

    // 4. GET /api/canvases
    const resList = await fetch(`${baseUrl}/api/canvases`).then((r) => r.json());
    console.log('GET canvases returned list:', Array.isArray(resList.data) ? 'PASS' : 'FAIL');

    // 5. GET /api/canvases/:id
    const resGet = await fetch(`${baseUrl}/api/canvases/${canvasId}`);
    console.log('GET canvas by ID returned 200:', resGet.status === 200 ? 'PASS' : 'FAIL');

    // 6. PUT /api/canvases/:id
    const resPut = await fetch(`${baseUrl}/api/canvases/${canvasId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Updated HTTP Canvas',
        elements: [
          {
            elementId: 'r-1',
            type: 'rectangle',
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            rotation: 0,
            fill: '#EF4444'
          }
        ]
      })
    });
    const putJson = await resPut.json();
    console.log('PUT canvas returned 200:', resPut.status === 200 ? 'PASS' : 'FAIL');
    console.log('Updated element count:', putJson.data.elements.length === 1 ? 'PASS' : 'FAIL');

    // 7. GET invalid ID (cast error)
    const resInvalidId = await fetch(`${baseUrl}/api/canvases/123-not-an-id`);
    console.log('Invalid ID handled with 400:', resInvalidId.status === 400 ? 'PASS' : 'FAIL');

    // 8. 404 for missing route
    const resNotFound = await fetch(`${baseUrl}/api/non-existent-route`);
    console.log('404 for nonexistent route:', resNotFound.status === 404 ? 'PASS' : 'FAIL');

    // 9. DELETE /api/canvases/:id
    const resDelete = await fetch(`${baseUrl}/api/canvases/${canvasId}`, {
      method: 'DELETE'
    });
    console.log('DELETE canvas returned 200:', resDelete.status === 200 ? 'PASS' : 'FAIL');

    // 10. GET deleted ID -> 404
    const resGetDeleted = await fetch(`${baseUrl}/api/canvases/${canvasId}`);
    console.log('Deleted canvas returns 404:', resGetDeleted.status === 404 ? 'PASS' : 'FAIL');

    console.log('\nAll HTTP REST API tests PASSED successfully!');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

testHttpEndpoints().catch((err) => {
  console.error('HTTP test error:', err);
  process.exit(1);
});
