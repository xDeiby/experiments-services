import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { PORT } from './config/settings';
import unknownEndpoint from './middlewares/unknownEndpoint';
import '@src/database';
import errorHandler from './middlewares/errorHandler';
import questionRouter from './controllers/question';
import sectionRouter from './controllers/section';
import experimentRouter from './controllers/experiment';
import modelTypeRouter from './controllers/model-type';
import logChangeRouter from './controllers/log-change';
import answerRouter from './controllers/answer';
import imageRouter from './controllers/image-model';

// Application
const app = express();
app.set('port', PORT);

// Middlewares
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Endpoints Services

// Questions
app.use('/api/questions', questionRouter);

// Sections
app.use('/api/sections', sectionRouter);

// Experiments
app.use('/api/experiments', experimentRouter);

// Model
app.use('/api/model_types', modelTypeRouter);

// Logs
app.use('/api/logs', logChangeRouter);

// Answers
app.use('/api/answers', answerRouter);

// Images Details
app.use('/api/images', imageRouter);

// Image
app.use('/api/uploads', express.static(path.resolve('uploads')));

// Validation middlewares
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
