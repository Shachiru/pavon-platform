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

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    logger.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
}

logger.info(`Attempting to connect to MongoDB at: ${MONGO_URI.replace(/:([^:@]+)@/, ':****@')}`);

mongoose.connect(MONGO_URI)
    .then(() => {
        logger.info('MongoDB connected');
        app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
    })
    .catch(err => {
        logger.error('MongoDB connection error:', err);
        process.exit(1);
    });