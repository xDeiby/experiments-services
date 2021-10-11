/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express';
import ImageModel from '../../models/ImageModel';
import Question from '../../models/Question';
import Section, { ETypeSection } from '../../models/Section';
import Experiment, { IExperiment } from '../../models/Experiment';

// New Experiment
function createExperiment(req: Request, res: Response, next: NextFunction): void {
    const experimentFields = req.body;

    const experiment = new Experiment({ ...experimentFields, creationDate: new Date() });
    experiment
        .save()
        .then((result: IExperiment) =>
            result
                .populate('modelType')
                .execPopulate()
                .then((expe) => res.status(200).json(expe))
        )
        .catch((err) => next(err));
}

// All Experiments
async function allExperiments(req: Request, res: Response): Promise<void> {
    const { aviables } = req.query;

    const experiments = await Experiment.find({}).populate('modelType');
    if (aviables === 'true') {
        const expFiltered = experiments.filter((expe) => expe.terms);
        if (expFiltered.length) {
            const quizzes = await Section.find({ type: ETypeSection.QUIZ });
            const questions = await Question.find({ section: { $in: quizzes.map((quiz) => quiz.id) } });
            const modelImages = await ImageModel.find({});

            const readyQuizzes = quizzes.filter(
                (quiz) =>
                    questions.filter(
                        (question) => quiz._id.equals(question.section) && question.alternatives.length > 1
                    ).length && modelImages.filter((imgDet) => quiz._id.equals(imgDet.quiz)).length
            );

            const aviableExperiments: IExperiment[] = expFiltered.filter((experiment) =>
                readyQuizzes.some((quiz) => experiment._id.equals(quiz.experiment))
            );

            res.status(200).json(aviableExperiments);
        } else {
            res.status(200).json(expFiltered);
        }
    } else {
        res.status(200).json(experiments);
    }

    // Experiment.find({})
    //     .populate('modelType')
    //     .then((result: IExperiment[]) => res.status(200).json(result));
}

// Experiment by Id
function experimentById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    Experiment.findById(id)
        .populate('modelType')
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((err) => next(err));
}

// Modify Experiment
function modifyById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { body } = req;

    Experiment.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}

// Remove Experiment
function removeExperiment(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    Experiment.deleteOne({ _id: id })
        .then(({ deletedCount }) => (deletedCount ? res.status(204).end() : res.status(404).end()))
        .catch((error) => next(error));
}

export { createExperiment, allExperiments, experimentById, removeExperiment, modifyById };
