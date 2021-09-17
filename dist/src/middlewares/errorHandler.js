"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, req, res, next) => {
    console.log(error.name);
    if (error.name === 'ValidationError') {
        res.status(500).send({ error: error.message });
    }
    else if (error.name === 'CastError') {
        res.status(500).send({ error: error.message });
    }
    else {
        next(error);
    }
};
exports.default = errorHandler;
