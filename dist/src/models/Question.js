"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETypeQuestion = void 0;
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
var ETypeQuestion;
(function (ETypeQuestion) {
    ETypeQuestion[ETypeQuestion["SELECT"] = 0] = "SELECT";
    ETypeQuestion[ETypeQuestion["MULTIPLY"] = 1] = "MULTIPLY";
    ETypeQuestion[ETypeQuestion["LIST"] = 2] = "LIST";
})(ETypeQuestion = exports.ETypeQuestion || (exports.ETypeQuestion = {}));
const questionSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        required: true,
    },
    required: {
        type: Boolean,
        required: true,
    },
    timeResp: Date,
    points: Number,
    explanation: String,
    alternatives: [
        {
            value: String,
            selected: Boolean,
            isCorrect: Boolean,
        },
    ],
    experiment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Experiment',
        required: true,
    },
    section: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
    },
});
questionSchema.plugin(mongoose_unique_validator_1.default);
const Question = (0, mongoose_1.model)('Question', questionSchema);
exports.default = Question;
