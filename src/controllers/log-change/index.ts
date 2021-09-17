import { Router } from 'express';
import { allChanges, createChange, logChangeById, modifyById, removeChange } from './services';

const logChangeRouter = Router();

// Create change
logChangeRouter.post('/', createChange);

// Get All changes
logChangeRouter.get('/', allChanges);

// Get change By Id
logChangeRouter.get('/:id', logChangeById);

// Modify Changes by Id
logChangeRouter.put('/:id', modifyById);

// Remove change by Id
logChangeRouter.delete('/:id', removeChange);

export default logChangeRouter;
