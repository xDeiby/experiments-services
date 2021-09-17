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
exports.modifyById = exports.sectionById = exports.removeSection = exports.allSection = exports.newSection = void 0;
const Section_1 = __importDefault(require("../../models/Section"));
function newSection(req, res, next) {
    const sectionFields = req.body;
    const section = new Section_1.default(sectionFields);
    section
        .save()
        .then((result) => res.status(201).json(result))
        .catch((err) => next(err));
}
exports.newSection = newSection;
function allSection(req, res, next) {
    const { experimentId } = req.query;
    if (experimentId) {
        Section_1.default.find({ experiment: experimentId })
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error));
    }
    else {
        Section_1.default.find({}).then((result) => res.status(200).json(result));
    }
}
exports.allSection = allSection;
function sectionById(req, res, next) {
    const { id } = req.params;
    Section_1.default.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(400).end()))
        .catch((error) => next(error));
}
exports.sectionById = sectionById;
function modifyById(req, res, next) {
    const { id } = req.params;
    const { body } = req;
    Section_1.default.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}
exports.modifyById = modifyById;
function removeSection(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const remove = yield Section_1.default.deleteOne({ _id: id });
            if (remove.deletedCount === 0)
                res.status(404).end();
            res.status(204).end();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.removeSection = removeSection;
