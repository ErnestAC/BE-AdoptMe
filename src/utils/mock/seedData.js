// src/utils/mock/seed.js

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '../../../.env.dev') });

import mongoose from 'mongoose';
import { generateMockPet } from './mockPets.js';
import { generateMockUser } from './mockUsers.js';
import { logger } from '../logger.js';

import Users from '../../dao/Users.dao.js';
import Pets from '../../dao/Pets.dao.js';

mongoose.set('strictQuery', true);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

const usersDao = new Users();
const petsDao = new Pets();

const seedDatabase = async () => {
    try {
        logger.info('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGO_URI);
        logger.info('Connected to MongoDB');

        // Generate mock data
        const mockUsers = Array.from({ length: 5 }, generateMockUser);
        const mockPets = Array.from({ length: 5 }, generateMockPet);

        // Save to DB
        for (const user of mockUsers) {
            await usersDao.save(user);
        }

        for (const pet of mockPets) {
            await petsDao.save(pet);
        }

        logger.info('Mock users and pets inserted into database.');
    } catch (err) {
        logger.error('Error during seeding: ' + err);
    } finally {
        await mongoose.disconnect();
        logger.info('Disconnected from MongoDB');
    }
};

seedDatabase();
