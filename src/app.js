// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import logger from './utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'express-compression'
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import mocksRouter from './routes/mocks.router.js'
import sessionsRouter from './routes/sessions.router.js';
import loggerTestRouter from './routes/loggerTest.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appEnv = process.env.APP_ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `../.env.${appEnv}`) });

mongoose.set('strictQuery', false);
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI).catch(err => logger.error("MongoDB connection error:", err));

const app = express();

app.use(compression());

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/', loggerTestRouter);

// Error test route
app.get('/test-error', (req, res) => {
    throw new Error('Test error for logging');
});

app.use(errorHandler); // must be the last to work properly.

export default app;
