/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction, Request, Response } from 'express';
import fs from 'fs-extra';
import cloudinaryV2 from '../../libs/cloudinary';
import ImageModel from '../../models/ImageModel';

// Save Image
const saveImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { title, description, modelJson, quiz, experiment } = req.body;
    const { file } = req;

    try {
        const imageResult = await cloudinaryV2.uploader.upload(file!.path);

        const newImage = new ImageModel({
            title,
            description,
            modelJson,
            quiz,
            experiment,
            pathImage: imageResult.secure_url,
            cloudinaryId: imageResult.public_id,
        });

        const result = await newImage.save();
        await fs.unlink(file!.path);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
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
const removeImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
        const removedImg = await ImageModel.findByIdAndRemove(id);
        if (removedImg) {
            await cloudinaryV2.uploader.destroy(removedImg.cloudinaryId);
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        next(error);
    }
};

export { saveImage, allImages, removeImage };
