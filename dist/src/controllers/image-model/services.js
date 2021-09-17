"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImage = exports.allImages = exports.saveImage = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ImageModel_1 = __importDefault(require("../../models/ImageModel"));
const saveImage = (req, res, next) => {
    const { title, description, modelJson, quiz, experiment } = req.body;
    const { file } = req;
    const newImage = new ImageModel_1.default({
        title,
        description,
        modelJson,
        quiz,
        experiment,
        pathImage: file === null || file === void 0 ? void 0 : file.path,
    });
    newImage
        .save()
        .then((result) => res.status(201).json(result))
        .catch((error) => next(error));
};
exports.saveImage = saveImage;
const allImages = (req, res, next) => {
    const { experimentId } = req.query;
    if (experimentId) {
        ImageModel_1.default.find({ experiment: experimentId })
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error));
    }
    else {
        ImageModel_1.default.find().then((result) => res.status(200).json(result));
    }
};
exports.allImages = allImages;
const removeImage = (req, res, next) => {
    const { id } = req.params;
    ImageModel_1.default.findByIdAndRemove(id)
        .then((result) => {
        if (result) {
            fs_extra_1.default.unlink(path_1.default.resolve(result.pathImage));
            res.status(204).end();
        }
        else {
            res.status(404).end();
        }
    })
        .catch((error) => next(error));
};
exports.removeImage = removeImage;
