// src/routes/mocks.router.js

import { Router } from 'express';
import { generateMockUsers } from '../utils/mock/mockUsers.js';
import { generateMockPets } from '../utils/mock/mockPets.js';
import { getLogger } from '../utils/logger.js';
import userModel from '../dao/models/User.js';
import petModel from '../dao/models/Pet.js';
import { CustomError } from '../utils/errors/CustomError.js';
import { ERROR_DICTIONARY } from '../utils/errorDictionary.js';

const fallbackLogger = getLogger();
const router = Router();

router.get('/mockingusers', async (req, res, next) => {
    const logger = req.logger || fallbackLogger;
    try {
        const users = generateMockUsers(50);
        res.send({ status: "success", payload: users });
    } catch (error) {
        logger.error("Error generating mock users:", error);
        next(new CustomError({ ...ERROR_DICTIONARY.MOCK_GENERATION_FAILED }));
    }
});

router.get('/mockingpets', async (req, res, next) => {
    const logger = req.logger || fallbackLogger;
    try {
        const pets = generateMockPets(100);
        res.send({ status: "success", payload: pets });
    } catch (error) {
        logger.error("Error generating mock pets:", error);
        next(new CustomError({ ...ERROR_DICTIONARY.MOCK_GENERATION_FAILED }));
    }
});

router.post('/generatedata', async (req, res, next) => {
    const logger = req.logger || fallbackLogger;
    const { users: usersParam, pets: petsParam } = req.query;

    const numUsers = parseInt(usersParam, 10);
    const numPets = parseInt(petsParam, 10);

    if (isNaN(numUsers) || isNaN(numPets)) {
        logger.debug(`Invalid parameters: users='${usersParam}', pets='${petsParam}'`);
        return next(new CustomError({
            ...ERROR_DICTIONARY.INVALID_QUERY_PARAMS,
            status: 400
        }));
    }

    logger.info(`Generating ${numUsers} mock users and ${numPets} mock pets...`);

    const users = generateMockUsers(numUsers);
    const pets = generateMockPets(numPets);

    try {
        const insertedUsers = await userModel.insertMany(users);
        const insertedPets = await petModel.insertMany(pets);

        logger.info(`Inserted ${insertedUsers.length} users and ${insertedPets.length} pets into the database.`);

        res.send({
            status: "success",
            message: "Mock data successfully generated and inserted.",
            payload: {
                users: insertedUsers,
                pets: insertedPets
            }
        });
    } catch (error) {
        logger.error("Error inserting mock data into the database:", error);
        next(new CustomError({ ...ERROR_DICTIONARY.MOCK_INSERT_FAILED }));
    }
});

export default router;
