import { Request, Response, NextFunction } from 'express';

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
    console.log(error.name);

    // Field
    if (error.name === 'ValidationError') {
        res.status(500).send({ error: error.message });
    } else if (error.name === 'CastError') {
        res.status(500).send({ error: error.message });
    } else {
        next(error);
    }
};

export default errorHandler;
