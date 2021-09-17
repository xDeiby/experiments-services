"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = require("express");
const Answer_1 = __importDefault(require("../../models/Answer"));
const Experiment_1 = __importDefault(require("../../models/Experiment"));
const ModelType_1 = __importDefault(require("../../models/ModelType"));
const Question_1 = __importDefault(require("../../models/Question"));
const Section_1 = __importStar(require("../../models/Section"));
const ImageModel_1 = __importDefault(require("../../models/ImageModel"));
const answerRouter = (0, express_1.Router)();
answerRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    const answerModify = yield Answer_1.default.findByIdAndUpdate(id, body, {
        new: true,
    });
    res.status(201).json(answerModify);
}));
answerRouter.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = {};
    const total = yield Answer_1.default.countDocuments().exec();
    if (endIndex < total) {
        result.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        result.previous = {
            page: page - 1,
            limit,
        };
    }
    try {
        result.data = yield Answer_1.default.find().limit(limit).skip(startIndex);
        result.total = total;
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
}));
answerRouter.post('/', (req, res, next) => {
    const { body } = req;
    body.creationDate = new Date();
    const newAnswer = new Answer_1.default(body);
    newAnswer
        .save()
        .then((result) => res.status(201).json({
        creationDate: result.creationDate,
        experiment: result.experiment,
        userName: result.userName,
        quizzes: JSON.parse(result.quizzes),
        surveys: JSON.parse(result.surveys),
    }))
        .catch((error) => next(error));
});
answerRouter.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const modelType = yield ModelType_1.default.findById(id);
        if (modelType) {
            const experiment = yield Experiment_1.default.findOne({ modelType: modelType.id });
            const sections = yield Section_1.default.find({ experiment: experiment === null || experiment === void 0 ? void 0 : experiment.id });
            const questions = yield Question_1.default.find({ experiment: experiment === null || experiment === void 0 ? void 0 : experiment.id });
            const images = yield ImageModel_1.default.find({ experiment: experiment === null || experiment === void 0 ? void 0 : experiment.id });
            const survey = sections.filter((section) => section.type === Section_1.ETypeSection.SURVEY);
            const quiz = sections.filter((section) => section.type === Section_1.ETypeSection.QUIZ);
            const answerElements = {
                experiment,
                surveys: survey.map((section) => ({
                    section,
                    questions: questions.filter((question) => section._id.equals(question.section)),
                })),
                quizzes: quiz.map((section) => ({
                    section,
                    questions: questions.filter((question) => section._id.equals(question.section)),
                    imageDetails: images.find((img) => section._id.equals(img.quiz)),
                })),
            };
            res.status(200).json(answerElements);
        }
        res.status(404).end();
    }
    catch (error) {
        next(error);
    }
}));
exports.default = answerRouter;
