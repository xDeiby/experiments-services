"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETypeChange = void 0;
const mongoose_1 = require("mongoose");
var ETypeChange;
(function (ETypeChange) {
    ETypeChange["SMALL"] = "SMALL_CHANGES";
    ETypeChange["IMPORTANT"] = "IMPORTANT_CHANGES";
})(ETypeChange = exports.ETypeChange || (exports.ETypeChange = {}));
const logChangesSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    typeChanges: {
        type: String,
        required: true,
    },
    experiment: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const LogChange = (0, mongoose_1.model)('logChange', logChangesSchema);
exports.default = LogChange;
