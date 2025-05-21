// users.router.js

import { Router } from 'express';
import { generateMockUsers } from '../utils/mock/mockUsers.js';
import { generateMockPets } from '../utils/mock/mockPets.js';
import  logger  from '../utils/logger.js'
import  userModel  from '../dao/models/User.js';
import  petModel  from '../dao/models/Pet.js';

const router = Router();

router.get('/mockingusers',async(req, res)=>{
    let users = generateMockUsers(50)   
    res.send({status:"success",payload:users})
});

router.get('/mockingpets',async(req, res)=>{
    let pets = generateMockPets(50)   
    res.send({status:"success",payload:pets})
});

router.post('/generatedata', async (req, res) => {
    const { users: usersParam, pets: petsParam } = req.query;

    const numUsers = parseInt(usersParam, 10);
    const numPets = parseInt(petsParam, 10);

    if (isNaN(numUsers) || isNaN(numPets)) {
        logger.warn(`Invalid parameters: users='${usersParam}', pets='${petsParam}'`);
        return res.status(400).send({
            status: "error",
            message: "Both 'users' and 'pets' query parameters must be valid numbers."
        });
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
        res.status(500).send({
            status: "error",
            message: "Failed to insert mock data into the database.",
            error: error.message
        });
    }
});

export default router;