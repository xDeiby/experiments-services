/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */

import { Router, Request, Response, NextFunction } from 'express';
import Answer from '../../models/Answer';
import Experiment from '../../models/Experiment';
import ModelType from '../../models/ModelType';
import Question from '../../models/Question';
import Section, { ETypeSection } from '../../models/Section';
import ImageModel from '../../models/ImageModel';

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

// Create
// answerRouter.post('/', async (req: Request, res: Response) => {
//     const { body } = req;

//     // const encoded_experiment = {
//     //     experiment: body.experiment,
//     //     encoded_quiz: JSON.stringify(body.quiz),
//     //     encoded_survey: JSON.stringify(body.survey),
//     //     creationDate: new Date(),
//     // };

//     const existAviableExp = await Answer.findOne({
//         state: EAnswerState.AVIABLE,
//     });

//     if (!existAviableExp) {
//         const model = await ModelType.findOne({
//             abbreviation: body.modelType,
//         });
//         const experiment = await Experiment.findOne({ modelType: model?.id });

//         const sections = await Section.find({ experiment: experiment?.id });
//         const questions = await Question.find({ experiment: experiment?.id });

//         const survey = sections.filter((section) => section.type === ETypeSection.SURVEY);
//         const quiz = sections.filter((section) => section.type === ETypeSection.QUIZ);

//         const answerElements = {
//             ...body,
//             experiment: experiment?.id,
//             survey: JSON.stringify(
//                 survey.map((section) => ({
//                     section,
//                     questions: questions.filter((question) => section._id.equals(question.section)),
//                 }))
//             ),
//             quiz: JSON.stringify(
//                 quiz.map((section) => ({
//                     section,
//                     questions: questions.filter((question) => section._id.equals(question.section)),
//                 }))
//             ),
//             creationDate: new Date(),
//         };

//         const newAnswer = new Answer(answerElements);
//         const saveResult = await newAnswer.save();

//         res.status(201).json(saveResult);
//     } else {
//         res.status(400).json({
//             error: 'Ya existe un experimento disponible, que no se ha respondido',
//         });
//     }
// });

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
    async (req: Request<any, any, any, { page: string; limit: string }>, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
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
            //       .limit(limit).skip(startIndex) replaced the slice method because
            //       it is done directly from mongodb and they are one of mongodb methods
            result.data = await Answer.find().limit(limit).skip(startIndex);
            result.total = total;

            res.status(200).json(result);
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
                creationDate: result.creationDate,
                experiment: result.experiment,
                userName: result.userName,
                quizzes: JSON.parse(result.quizzes),
                surveys: JSON.parse(result.surveys),
            })
        )
        .catch((error) => next(error));
});

// answerRouter.get("/:id", async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const answer = await Answer.findById(id);

//     res.status(200).json(answer);
// });

// answerRouter.get('/forms', async (req: Request, res: Response) => {
//     const answerAviable = await Answer.findOne({
//         state: EAnswerState.AVIABLE,
//     });

//     if (answerAviable) {
//         answerAviable.state = EAnswerState.EXECUTION;
//         await answerAviable.save();
//         const experimentInfo = await Experiment.findById(answerAviable.experiment);

//         res.status(201).json({
//             id: answerAviable.id,
//             username: answerAviable.username,
//             experiment: experimentInfo,
//             survey: JSON.parse(answerAviable.survey),
//             quiz: JSON.parse(answerAviable.quiz),
//         });
//     } else {
//         res.status(201).json({ error: 'No hay experimento disponible' });
//     }
// });

// Experiment Answer by Model id
answerRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
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
                surveys: survey.map((section) => ({
                    section,
                    questions: questions.filter((question) => section._id.equals(question.section)),
                })),
                quizzes: quiz.map((section) => ({
                    section,
                    questions: questions.filter((question) => section._id.equals(question.section)),
                    imageDetails: images.find((img) => section._id.equals(img.quiz)),
                })),
            };

            res.status(200).json(answerElements);
        }
        res.status(404).end();
    } catch (error) {
        next(error);
    }
});
export default answerRouter;
