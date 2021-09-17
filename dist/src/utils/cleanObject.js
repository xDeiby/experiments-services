"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cleanObject = (schema) => {
    schema.options.toJSON = {
        virtuals: true,
        versionKey: false,
        transform(document, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
        },
    };
};
exports.default = cleanObject;
