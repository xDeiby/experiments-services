import mongoose from 'mongoose';
import { MONGODB_URI } from './config/settings';
import cleanObject from './utils/cleanObject';

const DEFAULT_URI = 'mongodb://localhost/websocket-app';

// Connect to mongoDB and config params
mongoose
    .connect(MONGODB_URI || DEFAULT_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

// Remove fields _id and _v
mongoose.plugin(cleanObject);
