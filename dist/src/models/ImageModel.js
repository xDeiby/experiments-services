"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const imageSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pathImage: {
        type: String,
        required: true,
    },
    modelJson: {
        type: String,
        required: true,
    },
    quiz: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Section',
        unique: true,
        required: true,
    },
    experiment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Experiment',
        required: true,
    },
});
imageSchema.plugin(mongoose_unique_validator_1.default);
const ImageModel = (0, mongoose_1.model)('ImageModel', imageSchema);
exports.default = ImageModel;
