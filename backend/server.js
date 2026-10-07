const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Employee Task Backend Service is up and running!',
    timestamp: new Date()
  });
});

// Serve frontend static assets in production if available
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
if (require('fs').existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    }
  });
}

const PORT = process.env.PORT || 5000;

// Connect Database with auto-fallback to mongodb-memory-server
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_task_db';
  try {
    console.log(`Connecting to MongoDB at: ${mongoURI}...`);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ Connected to local/remote MongoDB successfully.');
  } catch (err) {
    console.warn('⚠️ Local MongoDB connection failed or timed out. Falling back to embedded MongoMemoryServer...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`✅ Connected to embedded MongoMemoryServer at: ${inMemoryUri}`);
    } catch (memErr) {
      console.error('❌ Failed to launch MongoMemoryServer:', memErr);
      process.exit(1);
    }
  }
};

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (http://localhost:${PORT})`);
  });
};

startServer();
