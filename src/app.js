import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// custom error handler
import { errorHandler } from './middlewares/errorHandler.js';

// custom console.log
import logger from './utils/logger.js';


import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import loggerTestRouter from './routes/loggerTest.router.js';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

mongoose.set('strictQuery', false);
const MONGO_URI = process.env.MONGO_URI;

const app = express();
const PORT = process.env.PORT||8080;
const connection = mongoose.connect(MONGO_URI)

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/', loggerTestRouter);

//testing for error handler
app.get('/test-error', (req, res) => {
    throw new Error('Test error for logging');
});

app.listen(PORT,()=>logger.info(`Listening on ${PORT}`))

//error logger
app.use(errorHandler);
