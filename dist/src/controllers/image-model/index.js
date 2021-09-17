"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../../libs/multer"));
const services_1 = require("./services");
const imageRouter = (0, express_1.Router)();
imageRouter.post('/', multer_1.default.single('file'), services_1.saveImage);
imageRouter.get('/', services_1.allImages);
imageRouter.delete('/:id', services_1.removeImage);
exports.default = imageRouter;
