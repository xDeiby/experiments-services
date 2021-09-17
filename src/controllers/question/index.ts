import { Router } from 'express';
import { allQuestions, modifyById, newQuestion, questionById, remove } from './services';

// Create Router
const questionRouter = Router();

// Create Question
questionRouter.post('/', newQuestion);

// Get All Questions
questionRouter.get('/', allQuestions);

// Get Question by Id
questionRouter.get('/:id', questionById);

// Modify Question by Id
questionRouter.put('/:id', modifyById);

// Remove Question by Id
questionRouter.delete('/:id', remove);

export default questionRouter;
