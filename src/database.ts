import mongoose from 'mongoose';
import { URI } from './config/settings';
import cleanObject from './utils/cleanObject';

// Connect to mongoDB and config params
mongoose
    .connect(URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

// Remove fields _id and _v
mongoose.plugin(cleanObject);
