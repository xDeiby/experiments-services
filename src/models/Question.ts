/* eslint-disable no-unused-vars */
import { Document, model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Type Questions
export enum ETypeQuestion {
    SELECT,
    MULTIPLY,
    LIST,
}

// Architecture of Alternative
export interface IAlternative {
    value: string;
    isCorrect?: boolean;
    selected?: boolean;
}

// Architecture of Question
export interface IQuestion extends Document {
    question: string;
    type: ETypeQuestion;
    required: boolean;
    section: string;
    alternatives: IAlternative[];
    experiment: string;
    timeResp?: number;
    points?: number;
    explanation?: string;
}

// Struture of Question
const questionSchema = new Schema({
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
    timeResp: Number,
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
        type: Schema.Types.ObjectId,
        ref: 'Experiment',
        required: true,
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
    },
});

// package to validate unique fields in mongo (In this case, 'title')
questionSchema.plugin(uniqueValidator);

// Question model to mongo
const Question = model<IQuestion>('Question', questionSchema);

export default Question;
