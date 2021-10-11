/* eslint-disable dot-notation */
import { Document, Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { defaultSection } from '../utils/defaultEntitys';
import Section, { ETypeSection } from './Section';

// Structure of Experiment
export interface IExperiment extends Document {
    id: string;
    title: string;
    creationDate: Date;
    modelType: string;
    terms: string;
}

// Architecture of Experiment
const experimentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    terms: String,
    creationDate: Date,
    modelType: {
        type: Schema.Types.ObjectId,
        ref: 'ModelType',
        required: true,
        unique: true,
    },
});

// package to validate unique fields in mongo (In this case, 'modelType')
experimentSchema.plugin(uniqueValidator);

// Remove experiment => remove dependencies (section and questions)
experimentSchema.pre<IExperiment>('deleteOne', async function (next) {
    const experimentId = (this as any).getQuery()['_id'];
    await model('Section').deleteMany({ experiment: experimentId });
    await model('Question').deleteMany({ experiment: experimentId });
    next();
});

// Create experiment => create one sections default (survey and quiz)
experimentSchema.pre('save', async function (next) {
    const experiment = this as IExperiment;
    const defaultSurvey = defaultSection(experiment.id);
    const defaultQuiz = defaultSection(experiment.id, ETypeSection.QUIZ);

    try {
        const survey = new Section(defaultSurvey);
        const quiz = new Section(defaultQuiz);

        await survey.save();
        await quiz.save();
    } catch (err: any) {
        next(err);
    }

    next();
});

// Experiment model to mongo
const Experiment = model<IExperiment>('Experiment', experimentSchema);

export default Experiment;
