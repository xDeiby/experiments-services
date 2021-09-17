"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeChange = exports.modifyById = exports.logChangeById = exports.allChanges = exports.createChange = void 0;
const LogChange_1 = __importDefault(require("../../models/LogChange"));
function createChange(req, res, next) {
    const { body } = req;
    body.creationDate = new Date();
    body.endDate = body.creationDate;
    const change = new LogChange_1.default(body);
    change
        .save()
        .then((result) => res.status(201).json(result))
        .catch((err) => next(err));
}
exports.createChange = createChange;
function allChanges(req, res, next) {
    const { idExperiment } = req.query;
    if (idExperiment) {
        LogChange_1.default.find({ experiment: idExperiment })
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error));
    }
    else {
        LogChange_1.default.find({}).then((result) => res.status(200).json(result));
    }
}
exports.allChanges = allChanges;
function logChangeById(req, res, next) {
    const { id } = req.params;
    LogChange_1.default.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((err) => next(err));
}
exports.logChangeById = logChangeById;
function modifyById(req, res, next) {
    const { id } = req.params;
    const { body } = req;
    body.endDate = new Date();
    LogChange_1.default.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}
exports.modifyById = modifyById;
function removeChange(req, res, next) {
    const { id } = req.params;
    LogChange_1.default.deleteOne({ _id: id })
        .then(({ deletedCount }) => (deletedCount ? res.status(204).end() : res.status(404).end()))
        .catch((error) => next(error));
}
exports.removeChange = removeChange;
