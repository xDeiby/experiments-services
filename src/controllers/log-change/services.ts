import { NextFunction, Request, Response } from 'express';
import LogChange, { ILogChange } from '@src/models/LogChange';

// TODO: Los servicios de cada service.ts son refactorizables, se puede crear una clase abstracta y cada service implementa los metodos abstractos (Hacer despues...)

// New change
function createChange(req: Request, res: Response, next: NextFunction): void {
    const { body } = req;
    body.creationDate = new Date();
    body.endDate = body.creationDate;

    const change = new LogChange(body);
    change
        .save()
        .then((result: ILogChange) => res.status(201).json(result))
        .catch((err) => next(err));
}

// All log changes
function allChanges(req: Request, res: Response, next: NextFunction): void {
    const { idExperiment } = req.query;

    if (idExperiment) {
        LogChange.find({ experiment: idExperiment as string })
            .then((result: ILogChange[]) => res.status(200).json(result))
            .catch((error) => next(error));
    } else {
        LogChange.find({}).then((result: ILogChange[]) => res.status(200).json(result));
    }
}

// Changes by Id
function logChangeById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    LogChange.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((err) => next(err));
}

// Modify log
function modifyById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { body } = req;
    body.endDate = new Date();

    LogChange.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}

// Remove changes
function removeChange(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    LogChange.deleteOne({ _id: id })
        .then(({ deletedCount }) => (deletedCount ? res.status(204).end() : res.status(404).end()))
        .catch((error) => next(error));
}

export { createChange, allChanges, logChangeById, modifyById, removeChange };
