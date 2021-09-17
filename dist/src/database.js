"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("./config/settings");
const cleanObject_1 = __importDefault(require("./utils/cleanObject"));
const DEFAULT_URI = 'mongodb://localhost/websocket-app';
mongoose_1.default
    .connect(settings_1.MONGODB_URI || DEFAULT_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));
mongoose_1.default.plugin(cleanObject_1.default);
