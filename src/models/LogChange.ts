/* eslint-disable no-unused-vars */
import { Document, model, Schema } from 'mongoose';

export enum ETypeChange {
    SMALL = 'SMALL_CHANGES',
    IMPORTANT = 'IMPORTANT_CHANGES',
}

export interface ILogChange extends Document {
    id: string;
    name: string;
    typeChanges: ETypeChange;
    experiment: string;
    creationDate: Date;
    endDate: Date;
}

const logChangesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    typeChanges: {
        type: String,
        required: true,
    },
    experiment: {
        type: Schema.Types.ObjectId,
        ref: 'Experiment',
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    creationDate: {
        type: Date,
        required: true,
    },
});

const LogChange = model<ILogChange>('logChange', logChangesSchema);

export default LogChange;
