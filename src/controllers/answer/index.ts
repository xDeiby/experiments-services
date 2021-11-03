/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */

import { Router, Request, Response, NextFunction } from 'express';
import Answer, { IAnswer } from '../../models/Answer';
import Experiment, { IExperiment } from '../../models/Experiment';
import ModelType from '../../models/ModelType';
import Question from '../../models/Question';
import Section, { ETypeSection } from '../../models/Section';
import ImageModel from '../../models/ImageModel';
import ExperimentMetadata from '../../utils/metadata/experiment/ExperimentMetadata2';

const answerRouter = Router();

export interface IPage {
    page: number;
    limit: number;
}

export interface IPaginationResult<T = any> {
    next: IPage;
    previous: IPage;
    data: T[];
    total: number;
}

// Modify
answerRouter.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;

    const answerModify = await Answer.findByIdAndUpdate(id, body, {
        new: true,
    });

    res.status(201).json(answerModify);
});

// Get All or Paginate
answerRouter.get(
    '/',
    async (
        req: Request<any, any, any, { page: string; limit: string; model: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const { model } = req.query;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result = {} as IPaginationResult;

        const total = await Answer.countDocuments().exec();

        if (endIndex < total) {
            result.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit,
            };
        }
        try {
            // if (model) {
            // }

            let answers = await Answer.find().limit(limit).skip(startIndex).populate('experiment');

            if (model) {
                answers = answers.filter((ans) => ((ans.experiment as IExperiment).modelType as any).equals(model));
            }
            result.data = answers;
            result.total = total;

            const metadataExperiments = new ExperimentMetadata(result.data as IAnswer[]);
            res.status(200).json(metadataExperiments.metadata());
        } catch (e) {
            next(e);
        }
    }
);

// Create
answerRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    body.creationDate = new Date();
    const newAnswer = new Answer(body);

    newAnswer
        .save()
        .then((result) =>
            res.status(201).json({
                id: result.id,
                creationDate: result.creationDate,
                experiment: result.experiment,
                userName: result.userName,
                quizzes: JSON.parse(result.quizzes),
                surveys: JSON.parse(result.surveys),
            })
        )
        .catch((error) => next(error));
});

// Experiment Answer by Model id
answerRouter.get('/model/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const modelType = await ModelType.findById(id);

        if (modelType) {
            const experiment = await Experiment.findOne({ modelType: modelType.id });
            const sections = await Section.find({ experiment: experiment?.id });
            const questions = await Question.find({ experiment: experiment?.id });
            const images = await ImageModel.find({ experiment: experiment?.id });

            const survey = sections.filter((section) => section.type === ETypeSection.SURVEY);
            const quiz = sections.filter((section) => section.type === ETypeSection.QUIZ);

            const answerElements = {
                experiment,
                surveys: survey
                    .map((section) => ({
                        section,
                        questions: questions.filter(
                            (question) => section._id.equals(question.section) && question.alternatives.length > 1
                        ),
                    }))
                    .filter((s) => s.questions.length && s.questions.some((q) => q.alternatives.length > 1)),
                quizzes: quiz
                    .map((section) => ({
                        section,
                        questions: questions.filter(
                            (question) => section._id.equals(question.section) && question.alternatives.length > 1
                        ),
                        imageDetails: images.find((img) => section._id.equals(img.quiz)),
                    }))
                    .filter(
                        (q) =>
                            q.questions.length &&
                            q.questions.some((ques) => ques.alternatives.length > 1) &&
                            q.imageDetails
                    ),
            };

            res.status(200).json(answerElements);
        }
        res.status(404).end();
    } catch (error) {
        next(error);
    }
});

// Experiment Answer by id
answerRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    Answer.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
});

export default answerRouter;
