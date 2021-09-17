import { NextFunction, Request, Response } from 'express';
import Section, { ISection } from '../../models/Section';

// New Question
function newSection(req: Request, res: Response, next: NextFunction): void {
    const sectionFields = req.body;

    const section = new Section(sectionFields);
    section
        .save()
        .then((result: ISection) => res.status(201).json(result))
        .catch((err) => next(err));
}

// All Questions
function allSection(req: Request, res: Response, next: NextFunction): void {
    const { experimentId } = req.query;

    if (experimentId) {
        Section.find({ experiment: experimentId as string })
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error));
    } else {
        Section.find({}).then((result) => res.status(200).json(result));
    }
}

// Get by id
function sectionById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    Section.findById(id)
        .then((result) => (result ? res.status(200).json(result) : res.status(400).end()))
        .catch((error) => next(error));
}

// Modify Section
function modifyById(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;
    const { body } = req;

    Section.findByIdAndUpdate(id, body, { new: true })
        .then((result) => (result ? res.status(200).json(result) : res.status(404).end()))
        .catch((error) => next(error));
}

// Remove Sections
async function removeSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    try {
        const remove = await Section.deleteOne({ _id: id });

        if (remove.deletedCount === 0) res.status(404).end();

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

export { newSection, allSection, removeSection, sectionById, modifyById };
