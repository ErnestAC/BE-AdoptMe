// controllers/users.controller.js

import { usersService } from "../services/index.js";
import logger from "../utils/logger.js";
import { ERROR_DICTIONARY } from "../utils/errorDictionary.js";
import { CustomError } from "../utils/errors/CustomError.js";

const getAllUsers = async (req, res, next) => {
    try {
        const users = await usersService.getAll();
        res.send({ status: "success", payload: users });
    } catch (error) {
        logger.error("Error in getAllUsers:", error);
        next(new CustomError({ ...ERROR_DICTIONARY.INTERNAL_SERVER_ERROR }));
    }
};

const getUser = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) {
            throw new CustomError({
                ...ERROR_DICTIONARY.USER_NOT_FOUND,
                status: 404
            });
        }
        res.send({ status: "success", payload: user });
    } catch (error) {
        logger.error("Error in getUser:", error);
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) {
            throw new CustomError({
                ...ERROR_DICTIONARY.USER_NOT_FOUND,
                status: 404
            });
        }

        await usersService.update(userId, updateBody);
        res.send({ status: "success", message: "User updated" });
    } catch (error) {
        logger.error("Error in updateUser:", error);
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) {
            throw new CustomError({
                ...ERROR_DICTIONARY.USER_NOT_FOUND,
                status: 404
            });
        }

        await usersService.delete(userId);
        res.send({ status: "success", message: "User deleted" });
    } catch (error) {
        logger.error("Error in deleteUser:", error);
        next(error);
    }
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
};
