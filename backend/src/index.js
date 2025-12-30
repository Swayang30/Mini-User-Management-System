
// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const helmet = require('helmet');
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const { errorHandler } = require('./middleware/errorHandler');

import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { errorHandler } from "./middlewares/errorHandler.js";
import User from './models/User.models.js';

import dotenv from 'dotenv';
import connectDB from './db/db.js';

dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 4000;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));
app.use(errorHandler);

async function ensureAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const existing = await User.findOne({ email: adminEmail });
    if (existing) return;
    const admin = new User({
      fullName: process.env.ADMIN_NAME || 'Admin User',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin123!',
      role: 'admin',
    });
    await admin.save();
    console.log('Admin user created:', admin.email);
  } catch (err) {
    console.error('Failed to ensure admin user:', err.message);
  }
}

// Start server after DB connection
async function start() {
  try {
    await connectDB();
    // create default admin if missing
    await ensureAdmin();

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

export default app;
