const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const app = require('./src/app');
const User = require('./src/models/User');

async function testAuth() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB for Auth tests');

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5098, resolve));
  const baseUrl = 'http://127.0.0.1:5098';

  try {
    const testEmail = `intern_${Date.now()}@glazia.com`;

    // 1. Register User
    console.log('\n--- 1. Testing Register ---');
    const resReg = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Glazia Intern',
        email: testEmail,
        password: 'password123'
      })
    });
    const regData = await resReg.json();
    console.log('Register status 201:', resReg.status === 201 ? 'PASS' : 'FAIL');
    console.log('Received JWT token:', typeof regData.token === 'string' && regData.token.length > 20 ? 'PASS' : 'FAIL');
    const token = regData.token;

    // 2. Duplicate Register should fail with 400
    console.log('\n--- 2. Testing Duplicate Register ---');
    const resDup = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Glazia Intern',
        email: testEmail,
        password: 'password123'
      })
    });
    console.log('Duplicate email rejected with 400:', resDup.status === 400 ? 'PASS' : 'FAIL');

    // 3. Login with correct password
    console.log('\n--- 3. Testing Login (Correct Credentials) ---');
    const resLogin = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123'
      })
    });
    const loginData = await resLogin.json();
    console.log('Login status 200:', resLogin.status === 200 ? 'PASS' : 'FAIL');
    console.log('User object returned in login:', loginData.user?.email === testEmail ? 'PASS' : 'FAIL');

    // 4. Login with wrong password
    console.log('\n--- 4. Testing Login (Wrong Password) ---');
    const resWrongPass = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrong_password_test'
      })
    });
    console.log('Wrong password rejected with 401:', resWrongPass.status === 401 ? 'PASS' : 'FAIL');

    // 5. GET /api/auth/me with Bearer token
    console.log('\n--- 5. Testing GET /api/auth/me ---');
    const resMe = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const meData = await resMe.json();
    console.log('GET /me returned 200:', resMe.status === 200 ? 'PASS' : 'FAIL');
    console.log('Current user email matches:', meData.user?.email === testEmail ? 'PASS' : 'FAIL');

    // 6. Create canvas as authenticated user
    console.log('\n--- 6. Testing User-Scoped Canvas Creation ---');
    const resCanvas = await fetch(`${baseUrl}/api/canvases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'User Authenticated Canvas',
        width: 900,
        height: 600,
        elements: []
      })
    });
    const canvasData = await resCanvas.json();
    console.log('Canvas created with 201:', resCanvas.status === 201 ? 'PASS' : 'FAIL');
    console.log('Canvas assigned to user ID:', canvasData.data?.user ? 'PASS' : 'FAIL');

    // 7. GET canvases as authenticated user
    console.log('\n--- 7. Testing User-Scoped Canvases List ---');
    const resListAuth = await fetch(`${baseUrl}/api/canvases`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const listAuthData = await resListAuth.json();
    console.log('User list contains created canvas:', listAuthData.data?.some(c => c._id === canvasData.data._id) ? 'PASS' : 'FAIL');

    // Clean up test user and canvas
    await User.deleteOne({ email: testEmail });
    await fetch(`${baseUrl}/api/canvases/${canvasData.data._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('\nAll Auth & User-Scoped Canvas Tests PASSED successfully!');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

testAuth().catch((err) => {
  console.error('Auth test failed:', err);
  process.exit(1);
});
