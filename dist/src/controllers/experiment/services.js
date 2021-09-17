"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyById = exports.removeExperiment = exports.experimentById = exports.allExperiments = exports.createExperiment = void 0;
const Experiment_1 = __importDefault(require("../../models/Experiment"));
function createExperiment(req, res, next) {
    const experimentFields = req.body;
    const experiment = new Experiment_1.default(Object.assign(Object.assign({}, experimentFields), { creationDate: new Date() }));
    experiment
        .save()
        .then((result) => res.status(201).json(result))
        .catch((err) => next(err));
}
exports.createExperiment = createExperiment;
function allExperiments(req, res) {
    Experiment_1.default.find({}).then((result) => res.status(200).json(result));
}
exports.allExperiments = allExperiments;
function experimentById(req, res, next) {
    const { id } = req.params;
    Experiment_1.default.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((err) => next(err));
}
exports.experimentById = experimentById;
function modifyById(req, res, next) {
    const { id } = req.params;
    const { body } = req;
    Experiment_1.default.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}
exports.modifyById = modifyById;
function removeExperiment(req, res, next) {
    const { id } = req.params;
    Experiment_1.default.deleteOne({ _id: id })
        .then(({ deletedCount }) => (deletedCount ? res.status(204).end() : res.status(404).end()))
        .catch((error) => next(error));
}
exports.removeExperiment = removeExperiment;
