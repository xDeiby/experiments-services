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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const answerSchema = new mongoose_1.Schema({
    userEmail: String,
    quizzes: {
        type: String,
    },
    surveys: {
        type: String,
    },
    creationDate: {
        type: Date,
        required: true,
    },
    experiment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Experiment',
    },
    userName: {
        type: String,
        required: true,
    },
});
const Answer = (0, mongoose_1.model)('Answer', answerSchema);
answerSchema.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield Answer.countDocuments().exec()) > 0)
        return console.log('user already inserted to database');
}));
exports.default = Answer;
