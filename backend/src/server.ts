import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pino from 'pino';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import errorHandler from './middleware/errorHandler';
import './config/passport';

const logger = pino();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    logger.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
}

logger.info(`Attempting to connect to MongoDB at: ${MONGO_URI.replace(/:([^:@]+)@/, ':****@')}`);

// MongoDB connection options
const mongooseOptions = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
};

mongoose.connect(MONGO_URI, mongooseOptions)
    .then(() => {
        logger.info('MongoDB connected successfully');
        app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
    })
    .catch(err => {
        logger.error('MongoDB connection error:', err.message);
        logger.error('Error details:', {
            name: err.name,
            code: err.code,
            codeName: err.codeName
        });

        // Common MongoDB Atlas connection issues
        if (err.message.includes('NOTFOUND')) {
            logger.error('DNS resolution failed. Check your internet connection or MongoDB URI.');
        } else if (err.message.includes('ETIMEDOUT')) {
            logger.error('Connection timed out. Check if your IP is whitelisted in MongoDB Atlas.');
        } else if (err.message.includes('Authentication failed')) {
            logger.error('Authentication failed. Check your MongoDB credentials.');
        }

        process.exit(1);
    });