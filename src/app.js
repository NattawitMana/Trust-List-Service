import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRouter from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', adminRouter);

// Simple Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Trustlist Backend API!',
    status: 'success'
  });
});

// Health check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

export default app;