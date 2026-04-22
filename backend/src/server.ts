import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { chatRouter } from './routes/chat';
import { mapsRouter } from './routes/maps';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/maps', mapsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

import fs from 'fs';

// Serve frontend static files if they exist (Monolithic deployment fallback)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // If no frontend files are found, just reply to root requests
  app.get('/', (req, res) => {
    res.send('Backend API is running. Frontend not found.');
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
