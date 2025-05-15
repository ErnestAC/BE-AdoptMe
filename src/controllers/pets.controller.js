// controllers/pets.controller.js

import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import logger from "../utils/logger.js";

const getAllPets = async (req, res) => {
    try {
        const pets = await petsService.getAll();
        res.send({ status: "success", payload: pets });
    } catch (error) {
        logger.error("Error in getAllPets:", error);
        res.status(500).send({ status: "error", error: "Failed to fetch pets" });
    }
};

const createPet = async (req, res) => {
    try {
        const { name, specie, birthDate } = req.body;
        if (!name || !specie || !birthDate) {
            return res.status(400).send({ status: "error", error: "Incomplete values" });
        }
        const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
        const result = await petsService.create(pet);
        res.send({ status: "success", payload: result });
    } catch (error) {
        logger.error("Error in createPet:", error);
        res.status(500).send({ status: "error", error: "Failed to create pet" });
    }
};

const updatePet = async (req, res) => {
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        const result = await petsService.update(petId, petUpdateBody);
        res.send({ status: "success", message: "Pet updated" });
        return result
    } catch (error) {
        logger.error("Error in updatePet:", error);
        res.status(500).send({ status: "error", error: "Failed to update pet" });
    }
};

const deletePet = async (req, res) => {
    try {
        const petId = req.params.pid;
        const result = await petsService.delete(petId);
        res.send({ status: "success", message: "Pet deleted" });
        return result
    } catch (error) {
        logger.error("Error in deletePet:", error);
        res.status(500).send({ status: "error", error: "Failed to delete pet" });
    }
};

const createPetWithImage = async (req, res) => {
    try {
        const file = req.file;
        const { name, specie, birthDate } = req.body;

        if (!name || !specie || !birthDate || !file) {
            return res.status(400).send({ status: "error", error: "Incomplete values or missing image file" });
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
        res.status(500).send({ status: "error", error: "Failed to create pet with image" });
    }
};

export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
};
