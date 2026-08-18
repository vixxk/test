import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/connect.js';
import { seedDatabase } from './db/seed.js';
import sceneRoutes from './routes/sceneRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', sceneRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    viewModesSupported: ['360° Standard View', '3D Anaglyph Red/Cyan', 'VR Stereoscopic Split']
  });
});

// Serve static assets & uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/', express.static(path.join(__dirname, 'public')));

// Fallback to index.html for single-page app navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Rudhvi3D Immersive Backend Server Running`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📹 1) 360° Standard View API: http://localhost:${PORT}/api/scenes`);
      console.log(`🕶️ 2) 3D Anaglyph View API:   http://localhost:${PORT}/api/view-modes`);
      console.log(`🥽 3) VR View API:           http://localhost:${PORT}/api/view-modes`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
  }
};

startServer();
