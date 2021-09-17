import { Router } from 'express';
import { allExperiments, createExperiment, experimentById, modifyById, removeExperiment } from './services';

const experimentRouter = Router();

// Create Experiment
experimentRouter.post('/', createExperiment);

// Get All Experiments
experimentRouter.get('/', allExperiments);

// Get Experiment By Id
experimentRouter.get('/:id', experimentById);

// Modify Experiment by Id
experimentRouter.put('/:id', modifyById);

// Remove Experiment by Id
experimentRouter.delete('/:id', removeExperiment);

export default experimentRouter;
