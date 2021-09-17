import { Router } from 'express';
import { allSection, modifyById, newSection, removeSection, sectionById } from './services';

const sectionRouter = Router();

// Create Section
sectionRouter.post('/', newSection);

// Get All Sections
sectionRouter.get('/', allSection);

// Get Section by id
sectionRouter.get('/:id', sectionById);

// Modify by Id
sectionRouter.put('/:id', modifyById);

// Remove Section by Id
sectionRouter.delete('/:id', removeSection);

export default sectionRouter;
