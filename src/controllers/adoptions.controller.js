// controllers/adoptions.controller.js

import {
    adoptionsService,
    petsService,
    usersService,
} from "../services/index.js";
import { CustomError } from "../utils/errors/CustomError.js";
import { ERROR_DICTIONARY } from "../utils/errorDictionary.js";

const getAllAdoptions = async (req, res, next) => {
    try {
        const result = await adoptionsService.getAll();
        res.send({ status: "success", payload: result });
    } catch (error) {
        next(new CustomError({ ...ERROR_DICTIONARY.INTERNAL_SERVER_ERROR }));
        res.send({ status: "failure", payload: error });
    }
};

const getAdoption = async (req, res, next) => {
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({ _id: adoptionId });

        if (!adoption) {
            throw new CustomError({
                ...ERROR_DICTIONARY.ADOPTION_NOT_FOUND,
                status: 404
            });
        }

        res.send({ status: "success", payload: adoption });
    } catch (error) {
        next(error);
    }
};

const createAdoption = async (req, res, next) => {
    try {
        const { uid, pid } = req.params;

        const user = await usersService.getUserById(uid);
        if (!user) {
            throw new CustomError({
                ...ERROR_DICTIONARY.USER_NOT_FOUND,
                status: 404
            });
        }

        const pet = await petsService.getBy({ _id: pid });
        if (!pet) {
            throw new CustomError({
                ...ERROR_DICTIONARY.PET_NOT_FOUND,
                status: 404
            });
        }

        if (pet.adopted) {
            throw new CustomError({
                ...ERROR_DICTIONARY.PET_ALREADY_ADOPTED,
                status: 400
            });
        }

        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets });
        await petsService.update(pet._id, { adopted: true, owner: user._id });
        await adoptionsService.create({ owner: user._id, pet: pet._id });

        res.send({ status: "success", message: "Pet adopted" });
    } catch (error) {
        next(error);
    }
};

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption,
};
