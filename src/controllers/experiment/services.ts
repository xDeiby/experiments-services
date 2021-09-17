import { NextFunction, Request, Response } from 'express';
import Experiment, { IExperiment } from '../../models/Experiment';

// New Experiment
function createExperiment(req: Request, res: Response, next: NextFunction): void {
    const experimentFields = req.body;

    const experiment = new Experiment({ ...experimentFields, creationDate: new Date() });
    experiment
        .save()
        .then((result: IExperiment) => res.status(201).json(result))
        .catch((err) => next(err));
}

// All Experiments
function allExperiments(req: Request, res: Response): void {
    Experiment.find({}).then((result: IExperiment[]) => res.status(200).json(result));
}

// Experiment by Id
function experimentById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    Experiment.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((err) => next(err));
}

// Modify Experiment
function modifyById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { body } = req;

    Experiment.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}

// Remove Experiment
function removeExperiment(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    Experiment.deleteOne({ _id: id })
        .then(({ deletedCount }) => (deletedCount ? res.status(204).end() : res.status(404).end()))
        .catch((error) => next(error));
}

export { createExperiment, allExperiments, experimentById, removeExperiment, modifyById };
