/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { Document } from 'mongoose';

const cleanObject = (schema: any): void => {
    schema.options.toJSON = {
        virtuals: true,
        versionKey: false,
        transform(document: Document, ret: any) {
            ret.id = ret._id.toString();
            delete ret._id;
        },
    };
};

export default cleanObject;
