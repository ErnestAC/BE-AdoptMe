// controllers/pets.controller.js

import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import logger from "../utils/logger.js";
import { ERROR_DICTIONARY } from "../utils/errorDictionary.js";
import { CustomError } from "../utils/errors/CustomError.js";

const getAllPets = async (req, res, next) => {
    try {
        const pets = await petsService.getAll();
        res.send({ status: "success", payload: pets });
    } catch (error) {
        logger.error("Error in getAllPets:", error);
        next(new CustomError({ ...ERROR_DICTIONARY.INTERNAL_SERVER_ERROR }));
    }
};

const createPet = async (req, res, next) => {
    try {
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            throw new CustomError({
                ...ERROR_DICTIONARY.INVALID_INPUT,
                status: 400
            });
        }

        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const result = await petsService.create(pet);
        res.send({ status: "success", payload: result });
    } catch (error) {
        logger.error("Error in createPet:", error);
        next(error);
    }
};

const updatePet = async (req, res, next) => {
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;

        const updated = await petsService.update(petId, petUpdateBody);
        res.send({ status: "success", message: "Pet updated", payload: updated });
    } catch (error) {
        logger.error("Error in updatePet:", error);
        next(error);
    }
};

const deletePet = async (req, res, next) => {
    try {
        const petId = req.params.pid;

        await petsService.delete(petId);
        res.send({ status: "success", message: "Pet deleted" });
    } catch (error) {
        logger.error("Error in deletePet:", error);
        next(error);
    }
};

const createPetWithImage = async (req, res, next) => {
    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;

        if (!name || !specie || !birthDate || !file) {
            throw new CustomError({
                ...ERROR_DICTIONARY.INVALID_INPUT,
                status: 400
            });
        }

        logger.info(file);

        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image: `${__dirname}/../public/img/${file.filename}`
        });

        logger.info(pet);

        const result = await petsService.create(pet);
        res.send({ status: "success", payload: result });
    } catch (error) {
        logger.error("Error in createPetWithImage:", error);
        next(error);
    }
};

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
};
