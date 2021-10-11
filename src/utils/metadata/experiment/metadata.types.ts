/* eslint-disable no-unused-vars */
import { IImageModel } from '../../../models/ImageModel';
import { IQuestion } from '../../../models/Question';
import { ISection } from '../../../models/Section';

export interface IFormElements {
    section: ISection;
    questions: IQuestion[];
    imageDetails?: IImageModel;
}

export interface ElementField<T> {
    field: T;
    header: string;
    ref: number;
}

export interface ICalculateFunction<T> {
    (data: T): number;
}

export enum EAlternativeValue {
    WRONG,
    COORRECT,
}
