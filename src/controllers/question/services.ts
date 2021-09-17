import { NextFunction, Request, Response } from 'express';
import Question, { IQuestion } from '@src/models/Question';

// New Question
function newQuestion(req: Request, res: Response, next: NextFunction): void {
    const questionFields = req.body;

    const question = new Question(questionFields);
    question
        .save()
        .then((result: IQuestion) => res.status(201).json(result))
        .catch((err) => next(err));
}

// All Questions
function allQuestions(req: Request, res: Response, next: NextFunction): void {
    const { experimentId } = req.query;

    if (experimentId) {
        Question.find({ experiment: experimentId as string })
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error));
    } else {
        Question.find({}).then((result: IQuestion[]) => res.status(200).json(result));
    }
}

// Question by Id
function questionById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    Question.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((err) => next(err));
}

// Modify Question
function modifyById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { body } = req;

    Question.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}

// Remove Question
function remove(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    Question.findByIdAndRemove(id)
        .then((result) => (result ? res.status(204).end() : res.status(404).end()))
        .catch((err) => next(err));
}

export { newQuestion, allQuestions, questionById, remove, modifyById };
