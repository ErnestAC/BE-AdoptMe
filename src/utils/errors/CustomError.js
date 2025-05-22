// src/utils/errors/CustomError.js

export class CustomError extends Error {
    constructor({ code, message, status = 500 }) {
        super(message);
        this.code = code;
        this.status = status;
    }
}
