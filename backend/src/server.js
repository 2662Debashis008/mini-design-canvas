const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start Express server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`[Server] Mini Design Canvas backend listening on port ${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[UnhandledRejection] Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
});
