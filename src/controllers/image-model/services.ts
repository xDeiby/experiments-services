import { NextFunction, Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import ImageModel from '../../models/ImageModel';

// Save Image
const saveImage = (req: Request, res: Response, next: NextFunction): void => {
    const { title, description, modelJson, quiz, experiment } = req.body;
    const { file } = req;

    const newImage = new ImageModel({
        title,
        description,
        modelJson,
        quiz,
        experiment,
        pathImage: file?.path,
    });

    newImage
        .save()
        .then((result) => res.status(201).json(result))
        .catch((error) => next(error));
};

// Get All Images
const allImages = (req: Request, res: Response, next: NextFunction): void => {
    const { experimentId } = req.query;

    if (experimentId) {
        ImageModel.find({ experiment: experimentId as string })
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error));
    } else {
        ImageModel.find().then((result) => res.status(200).json(result));
    }
};

// Remove Image
const removeImage = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;
    ImageModel.findByIdAndRemove(id)
        .then((result) => {
            if (result) {
                fs.unlink(path.resolve(result.pathImage));
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        })
        .catch((error) => next(error));
};

export { saveImage, allImages, removeImage };
