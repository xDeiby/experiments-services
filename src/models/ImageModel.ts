import { Document, model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import fs from 'fs-extra';

// Interface model
export interface IImageModel extends Document {
    title: string;
    description: string;
    pathImage: string;
    // cloudinaryId: string;
    modelJson: string;
    quiz: string;
    experiment: string;
}

// Model
const imageSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pathImage: {
        type: String,
        required: true,
        unique: true,
    },

    modelJson: {
        type: String,
        required: true,
    },
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        unique: true,
        required: true,
    },
    experiment: {
        type: Schema.Types.ObjectId,
        ref: 'Experiment',
        required: true,
    },
});

imageSchema.plugin(uniqueValidator);

// Model image to mongodb
imageSchema.pre('deleteOne', async function (next) {
    try {
        const sectionId = (this as any).getQuery().quiz;
        const modelImage = await ImageModel.findOne({ quiz: sectionId });
        if (modelImage) {
            await fs.unlink(modelImage.pathImage);
        }
    } catch (err: any) {
        next(err);
    }

    next();
});

const ImageModel = model<IImageModel>('ImageModel', imageSchema);

export default ImageModel;
