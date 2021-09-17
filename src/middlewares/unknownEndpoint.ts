import { Request, Response } from 'express';

const unknownEndpoint = (request: Request, response: Response) => {
    response.status(404).send({ error: 'Not Found' });
};

export default unknownEndpoint;
