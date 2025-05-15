// controllers/users.controllers.js

import { usersService } from "../services/index.js";
import logger from "../utils/logger.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await usersService.getAll();
        res.send({ status: "success", payload: users });
    } catch (error) {
        logger.error("Error in getAllUsers:", error);
        res.status(500).send({ status: "error", error: "Failed to fetch users" });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });
        res.send({ status: "success", payload: user });
    } catch (error) {
        logger.error("Error in getUser:", error);
        res.status(500).send({ status: "error", error: "Failed to fetch user" });
    }
};

const updateUser = async (req, res) => {
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });

        const result = await usersService.update(userId, updateBody);
        res.send({ status: "success", message: "User updated" });
        return result
    } catch (error) {
        logger.error("Error in updateUser:", error);
        res.status(500).send({ status: "error", error: "Failed to update user" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });

        await usersService.delete(userId);
        res.send({ status: "success", message: "User deleted" });
    } catch (error) {
        logger.error("Error in deleteUser:", error);
        res.status(500).send({ status: "error", error: "Failed to delete user" });
    }
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
};
