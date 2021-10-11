// Servicio solamente utilizado para realizar test end to end

import { Request, Response, Router } from 'express';
import Answer from '../models/Answer';
import Experiment from '../models/Experiment';
import ImageModel from '../models/ImageModel';
import LogChange from '../models/LogChange';
import ModelType from '../models/ModelType';
import Question from '../models/Question';
import Section from '../models/Section';

const reset = Router();

reset.post('/', async (req: Request, res: Response): Promise<void> => {
    await ModelType.deleteMany({});
    await Experiment.deleteMany({});
    await Section.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    await LogChange.deleteMany({});
    await ImageModel.deleteMany({});

    res.status(204).end();
});

export default reset;
