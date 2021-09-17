"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSection = exports.defaultQuestion = void 0;
const Question_1 = require("../models/Question");
const Section_1 = require("../models/Section");
const defaultQuestion = (experiment, section, typeSection = Section_1.ETypeSection.SURVEY) => (Object.assign({ section,
    experiment, question: 'Pregunta 1', required: true, type: Question_1.ETypeQuestion.SELECT, alternatives: [
        Object.assign({ value: 'Opcion 1' }, (typeSection === Section_1.ETypeSection.QUIZ && { isCorrect: true })),
    ] }, (typeSection === Section_1.ETypeSection.QUIZ && { points: 5 })));
exports.defaultQuestion = defaultQuestion;
const defaultSection = (experiment, type = Section_1.ETypeSection.SURVEY) => (Object.assign({ experiment }, (type === Section_1.ETypeSection.SURVEY
    ? {
        title: 'Sección 1',
        description: 'Descipción de esta sección que verá el experimentador',
        type: Section_1.ETypeSection.SURVEY,
    }
    : {
        title: 'Título del Quiz',
        description: 'Descipción de la evaluación que verá el experimentador antes de realizarla',
        type: Section_1.ETypeSection.QUIZ,
        quizTime: 300,
    })));
exports.defaultSection = defaultSection;
