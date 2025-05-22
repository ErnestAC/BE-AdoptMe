// controllers/sessions.controllers.js

import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import logger from '../utils/logger.js';
import { CustomError } from '../utils/errors/CustomError.js';
import { ERROR_DICTIONARY } from '../utils/errorDictionary.js';

const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            throw new CustomError({
                ...ERROR_DICTIONARY.INCOMPLETE_VALUES,
                status: 400
            });
        }

        const exists = await usersService.getUserByEmail(email);
        if (exists) {
            throw new CustomError({
                ...ERROR_DICTIONARY.USER_ALREADY_EXISTS,
                status: 400
            });
        }

        const hashedPassword = await createHash(password);
        const user = { first_name, last_name, email, password: hashedPassword };
        const result = await usersService.create(user);

        logger.info(result);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        logger.error(`Register error: ${error.message}`);
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new CustomError({
                ...ERROR_DICTIONARY.INCOMPLETE_VALUES,
                status: 400
            });
        }

        const user = await usersService.getUserByEmail(email);
        if (!user) {
            throw new CustomError({
                ...ERROR_DICTIONARY.USER_DOES_NOT_EXIST,
                status: 404
            });
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            throw new CustomError({
                ...ERROR_DICTIONARY.INVALID_PASSWORD,
                status: 400
            });
        }

        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto, 'tokenSecretJWT', { expiresIn: "1h" });

        res.cookie('coderCookie', token, { maxAge: 3600000 }).send({
            status: "success",
            message: "Logged in"
        });
    } catch (error) {
        next(error);
    }
};

const current = async (req, res, next) => {
    try {
        const cookie = req.cookies['coderCookie'];
        const user = jwt.verify(cookie, 'tokenSecretJWT');

        if (user) {
            return res.send({ status: "success", payload: user });
        }

        throw new CustomError({
            ...ERROR_DICTIONARY.UNAUTHORIZED,
            status: 401
        });
    } catch (error) {
        next(error);
    }
};

const unprotectedLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new CustomError({
                ...ERROR_DICTIONARY.INCOMPLETE_VALUES,
                status: 400
            });
        }

        const user = await usersService.getUserByEmail(email);
        if (!user) {
            throw new CustomError({
                ...ERROR_DICTIONARY.USER_DOES_NOT_EXIST,
                status: 404
            });
        }

        const isValidPassword = await passwordValidation(user, password);
        if (!isValidPassword) {
            throw new CustomError({
                ...ERROR_DICTIONARY.INVALID_PASSWORD,
                status: 400
            });
        }

        const token = jwt.sign(user, "tokenSecretJWT", { expiresIn: "1h" });
        res.cookie("unprotectedCookie", token, { maxAge: 3600000 }).send({
            status: "success",
            message: "Unprotected Logged in"
        });
    } catch (error) {
        logger.error(`Unprotected login error: ${error.message}`);
        next(error);
    }
};

const unprotectedCurrent = async (req, res, next) => {
    try {
        const cookie = req.cookies['unprotectedCookie'];
        const user = jwt.verify(cookie, 'tokenSecretJWT');

        if (user) {
            return res.send({ status: "success", payload: user });
        }

        throw new CustomError({
            ...ERROR_DICTIONARY.UNAUTHORIZED,
            status: 401
        });
    } catch (error) {
        logger.error(`Unprotected current error: ${error.message}`);
        next(error);
    }
};

export default {
    current,
    login,
    register,
    unprotectedLogin,
    unprotectedCurrent
};
