/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Document, model, Schema } from 'mongoose';
// eslint-disable-next-line import/no-cycle
import { defaultQuestion } from '../utils/defaultEntitys';
import Question from './Question';

// Type Sections
export enum ETypeSection {
    SURVEY,
    QUIZ,
}

// Architecture of Section
export interface ISection extends Document {
    id: string;
    title: string;
    description: string;
    type: ETypeSection;
    timeEnd?: number;
    quizTime?: number;
    experiment: string;
}

// Structure of Section
const sectionSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Experiment',
        required: true,
    },
});

// Remove fields children references
// eslint-disable-next-line func-names
sectionSchema.pre('deleteOne', async function (next) {
    // eslint-disable-next-line dot-notation
    const sectionId = (this as any).getQuery()['_id'];
    await model('Question').deleteMany({ section: sectionId });
    await model('ImageModel').deleteOne({ quiz: sectionId });
    next();
});

// Create section => create one default question for each section
sectionSchema.pre('save', async function (next) {
    const section = this as ISection;
    const defaultQuest = defaultQuestion(section.experiment, section.id, section.type);

    try {
        const newQuestion = new Question(defaultQuest);
        await newQuestion.save();
    } catch (err: any) {
        next(err);
    }

    next();
});

// Section model to mongo
const Section = model<ISection>('Section', sectionSchema);

export default Section;
