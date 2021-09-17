/* eslint-disable no-unused-vars */
import { Document, Schema, model } from 'mongoose';

// Struture of Answer
export interface IAnswer extends Document {
    id: string;
    experiment: string;
    quizzes: string;
    surveys: string;
    userName: string;
    userEmail: string;
    creationDate: Date;
}

// Architecture of Answer
const answerSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Experiment',
    },
    userName: {
        type: String,
        required: true,
    },
});

// Answer model to mongox
const Answer = model<IAnswer>('Answer', answerSchema);

// eslint-disable-next-line consistent-return
answerSchema.once('open', async () => {
    if ((await Answer.countDocuments().exec()) > 0) return console.log('user already inserted to database');
});

export default Answer;
