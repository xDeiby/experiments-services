import { Router } from 'express';
import { createModelType, allModelTypes, modifyById, modelById, removeModel } from './services';

const modelTypeRouter = Router();

// Create Model Type
modelTypeRouter.post('/', createModelType);

// Get All Models
modelTypeRouter.get('/', allModelTypes);

// Get Model by Id
modelTypeRouter.get('/:id', modelById);

// Modify Model Type by Id
modelTypeRouter.put('/:id', modifyById);

// Remove Model By id
modelTypeRouter.delete('/:id', removeModel);

export default modelTypeRouter;
