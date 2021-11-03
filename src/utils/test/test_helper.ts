import Experiment, { IExperiment } from '../../models/Experiment';
import ModelType, { IModelType } from '../../models/ModelType';
import Question, { ETypeQuestion, IQuestion } from '../../models/Question';
import Section, { ETypeSection, ISection } from '../../models/Section';

// Default Model
export const modelTest = {
    name: 'Model Test #1',
    abbreviation: 'model_test1',
};

// Default Experiment
export const experimentTest = {
    title: 'Experimento Test',
    description: 'Descripcion del experimento test',
    terms: 'Terminos y condiciones test',
};

// Default Quiz
export const quizTest = {
    title: 'Quiz Test',
    description: 'Evaluación para un test de integración',
    quizTime: 300,
    type: ETypeSection.QUIZ,
};

// Default Survey
export const surveyTest = {
    title: 'Survey Test',
    description: 'Encuesta para un test de integración',
    type: ETypeSection.SURVEY,
};

// Default Questions of Survey
export const questionsSurvTest = [
    {
        question: '¿Pregunta de Selección Excluyente?',
        type: ETypeQuestion.SELECT,
        required: false,
        alternatives: [{ value: 'Alternativa 1' }, { value: 'Alternativa 2' }, { value: 'Alternativa 3' }],
    },
    {
        question: '¿Pregunta de Selección Multiple?',
        type: ETypeQuestion.MULTIPLY,
        required: true,
        alternatives: [{ value: 'Alternativa 1' }, { value: 'Alternativa 2' }],
    },
    {
        question: '¿Pregunta tipo dropdown ?',
        type: ETypeQuestion.LIST,
        required: false,
        alternatives: [{ value: 'Alternativa 1' }],
    },
];

// Default Question of Quiz
export const questionQuizTest = {
    question: '¿Pregunta de Selección Excluyente?',
    type: ETypeQuestion.SELECT,
    required: true,
    points: 10,
    explanation: 'La opción 2 es correcta porque...',
    alternatives: [{ value: 'Alternativa 1' }, { value: 'Alternativa 2', isCorrect: true }, { value: 'Alternativa 3' }],
};

// All Models
export const modelsInDb = async (): Promise<IModelType[]> => {
    const models = await ModelType.find({});

    return models;
};

// All Experiments
export const experimentsInDb = async (): Promise<IExperiment[]> => {
    const experiments = await Experiment.find({});

    return experiments;
};

// All Sections
export const sectionsInDb = async (): Promise<ISection[]> => {
    const sections = await Section.find({});

    return sections;
};

// All Questions
export const questionsInDb = async (): Promise<IQuestion[]> => {
    const questions = await Question.find({});

    return questions;
};
