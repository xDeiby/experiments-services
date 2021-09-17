"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Not Found' });
};
exports.default = unknownEndpoint;
