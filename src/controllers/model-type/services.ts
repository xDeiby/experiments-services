import { NextFunction, Request, Response } from 'express';
import ModelType from '../../models/ModelType';
import Experiment from '../../models/Experiment';

// New Model Type
async function createModelType(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { body } = req;

    try {
        body.name = body.name.trim();
        if (!body.abbreviation) {
            body.abbreviation = body.name.trim().split(' ').join('_').toLowerCase();
        }
        const newModel = new ModelType(body);
        const result = await newModel.save();

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

// All Model Types
async function allModelTypes(req: Request, res: Response): Promise<void> {
    const { aviables } = req.query;
    const modelTypes = await ModelType.find({});

    if (aviables === 'true') {
        const occupiedModels = (await Experiment.find({})).map((experiment) => experiment.modelType);

        const aviableModels = modelTypes.filter(
            // eslint-disable-next-line no-underscore-dangle
            (model) => !occupiedModels.find((idModel) => (model as any)._id.equals(idModel))
        );

        res.status(200).json(aviableModels);
    } else if (aviables === 'false') {
        const occupiedModels = (await Experiment.find({})).map((experiment) => experiment.modelType);
        const aviableModels = modelTypes.filter((model) =>
            // eslint-disable-next-line no-underscore-dangle
            occupiedModels.find((idModel) => (model as any)._id.equals(idModel))
        );

        res.status(200).json(aviableModels);
    } else {
        res.status(200).json(modelTypes);
    }
}

// Model Type By id
function modelById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    ModelType.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((err) => next(err));
}

// Modify Type Model
function modifyById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { body } = req;

    ModelType.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}

// Remove Model Type
function removeModel(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    ModelType.deleteOne({ _id: id })
        .then(({ deletedCount }) => (deletedCount ? res.status(204).end() : res.status(404).end()))
        .catch((error) => next(error));
}

export { createModelType, allModelTypes, modifyById, modelById, removeModel };
