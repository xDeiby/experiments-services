"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyById = exports.remove = exports.questionById = exports.allQuestions = exports.newQuestion = void 0;
const Question_1 = __importDefault(require("../../models/Question"));
function newQuestion(req, res, next) {
    const questionFields = req.body;
    const question = new Question_1.default(questionFields);
    question
        .save()
        .then((result) => res.status(201).json(result))
        .catch((err) => next(err));
}
exports.newQuestion = newQuestion;
function allQuestions(req, res, next) {
    const { experimentId } = req.query;
    if (experimentId) {
        Question_1.default.find({ experiment: experimentId })
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error));
    }
    else {
        Question_1.default.find({}).then((result) => res.status(200).json(result));
    }
}
exports.allQuestions = allQuestions;
function questionById(req, res, next) {
    const { id } = req.params;
    Question_1.default.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((err) => next(err));
}
exports.questionById = questionById;
function modifyById(req, res, next) {
    const { id } = req.params;
    const { body } = req;
    Question_1.default.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}
exports.modifyById = modifyById;
function remove(req, res, next) {
    const { id } = req.params;
    Question_1.default.findByIdAndRemove(id)
        .then((result) => (result ? res.status(204).end() : res.status(404).end()))
        .catch((err) => next(err));
}
exports.remove = remove;
