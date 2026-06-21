// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import tripRoutes from './routes/tripRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';

// Initialize Express app
const app: Application = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'AI Travel Planner API',
    version: '1.0.0',
    status: 'running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
