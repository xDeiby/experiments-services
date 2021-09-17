"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeModel = exports.modelById = exports.modifyById = exports.allModelTypes = exports.createModelType = void 0;
const ModelType_1 = __importDefault(require("../../models/ModelType"));
const Experiment_1 = __importDefault(require("../../models/Experiment"));
function createModelType(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { body } = req;
        try {
            const newModel = new ModelType_1.default(body);
            const result = yield newModel.save();
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.createModelType = createModelType;
function allModelTypes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { aviables } = req.query;
        const modelTypes = yield ModelType_1.default.find({});
        if (aviables === 'true') {
            const occupiedModels = (yield Experiment_1.default.find({})).map((experiment) => experiment.modelType);
            const aviableModels = modelTypes.filter((model) => !occupiedModels.find((idModel) => model._id.equals(idModel)));
            res.status(200).json(aviableModels);
        }
        else if (aviables === 'false') {
            const occupiedModels = (yield Experiment_1.default.find({})).map((experiment) => experiment.modelType);
            const aviableModels = modelTypes.filter((model) => occupiedModels.find((idModel) => model._id.equals(idModel)));
            res.status(200).json(aviableModels);
        }
        else {
            res.status(200).json(modelTypes);
        }
    });
}
exports.allModelTypes = allModelTypes;
function modelById(req, res, next) {
    const { id } = req.params;
    ModelType_1.default.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((err) => next(err));
}
exports.modelById = modelById;
function modifyById(req, res, next) {
    const { id } = req.params;
    const { body } = req;
    ModelType_1.default.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}
exports.modifyById = modifyById;
function removeModel(req, res, next) {
    const { id } = req.params;
    ModelType_1.default.deleteOne({ _id: id })
        .then(({ deletedCount }) => (deletedCount ? res.status(204).end() : res.status(404).end()))
        .catch((error) => next(error));
}
exports.removeModel = removeModel;
