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
exports.ETypeSection = void 0;
const mongoose_1 = require("mongoose");
const defaultEntitys_1 = require("../utils/defaultEntitys");
const Question_1 = __importDefault(require("./Question"));
var ETypeSection;
(function (ETypeSection) {
    ETypeSection[ETypeSection["SURVEY"] = 0] = "SURVEY";
    ETypeSection[ETypeSection["QUIZ"] = 1] = "QUIZ";
})(ETypeSection = exports.ETypeSection || (exports.ETypeSection = {}));
const sectionSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        required: true,
    },
    timeEnd: Number,
    quizTime: Number,
    experiment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Experiment',
        required: true,
    },
});
sectionSchema.pre('deleteOne', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sectionId = this.getQuery()['_id'];
        yield (0, mongoose_1.model)('Question').deleteMany({ section: sectionId });
        next();
    });
});
sectionSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const section = this;
        const defaultQuest = (0, defaultEntitys_1.defaultQuestion)(section.experiment, section.id, section.type);
        try {
            const newQuestion = new Question_1.default(defaultQuest);
            yield newQuestion.save();
        }
        catch (err) {
            next(err);
        }
        next();
    });
});
const Section = (0, mongoose_1.model)('Section', sectionSchema);
exports.default = Section;
