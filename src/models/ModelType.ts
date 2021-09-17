import { Document, model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Structure of ModelType
export interface IModelType extends Document {
    id: string;
    name: string;
    abbreviation: string;
}

// Architecture of ModelType
const modelTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    abbreviation: {
        type: String,
        required: true,
        unique: true,
    },
});

// package to validate unique fields in mongo (In this case, 'name' and 'abbreviation')
modelTypeSchema.plugin(uniqueValidator);

modelTypeSchema.pre('deleteOne', async function (next) {
    // eslint-disable-next-line dot-notation
    const modelId = (this as any).getQuery()['_id'];
    await model('Experiment').deleteOne({ modelType: modelId });
    next();
});

// ModelType model to mongo
const ModelType = model<IModelType>('ModelType', modelTypeSchema);

export default ModelType;
