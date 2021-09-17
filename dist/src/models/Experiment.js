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
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const defaultEntitys_1 = require("../utils/defaultEntitys");
const Section_1 = __importStar(require("./Section"));
const experimentSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    creationDate: Date,
    modelType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ModelType',
        required: true,
        unique: true,
    },
});
experimentSchema.plugin(mongoose_unique_validator_1.default);
experimentSchema.pre('deleteOne', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const experimentId = this.getQuery()['_id'];
        yield (0, mongoose_1.model)('Section').deleteMany({ experiment: experimentId });
        yield (0, mongoose_1.model)('Question').deleteMany({ experiment: experimentId });
        next();
    });
});
experimentSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const experiment = this;
        const defaultSurvey = (0, defaultEntitys_1.defaultSection)(experiment.id);
        const defaultQuiz = (0, defaultEntitys_1.defaultSection)(experiment.id, Section_1.ETypeSection.QUIZ);
        try {
            const survey = new Section_1.default(defaultSurvey);
            const quiz = new Section_1.default(defaultQuiz);
            yield survey.save();
            yield quiz.save();
        }
        catch (err) {
            next(err);
        }
        next();
    });
});
const Experiment = (0, mongoose_1.model)('Experiment', experimentSchema);
exports.default = Experiment;
