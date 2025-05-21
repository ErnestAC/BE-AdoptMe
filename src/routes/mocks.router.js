// users.router.js

import { Router } from 'express';
import { generateMockUsers } from '../utils/mock/mockUsers.js';
import { generateMockPet } from '../utils/mock/mockPets.js';

const router = Router();

router.get('/',async(req, res)=>{
    let users = generateMockUsers(50)   
    res.send({status:"success",payload:users})
});

export default router;