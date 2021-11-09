/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { IAnswer, IAnswerObj } from '../../../models/Answer';
import { IQuestion } from '../../../models/Question';
import { IFormElements } from './metadata.types';

export enum QuizResponse {
    INCORRECT,
    CORRECT,
}

export default class ExperimentMetadata {
    private _experiment: IAnswer | IAnswerObj;

    public constructor(experiment: IAnswer | IAnswerObj) {
        this._experiment = experiment;
    }

    // Encuentra las respuestas de una pregunta
    private _findAnswerQuestionSurvey(question: IQuestion) {
        return question.alternatives
            .reduce<string>((resp, alt, index) => (alt.selected ? `${resp} ${index + 1}` : resp), '')
            .trim();
    }

    // Determina si una pregunta fue respondida correctamente
    private _isCorrectAnswer(question: IQuestion): QuizResponse {
        return question.alternatives.find((alt) => alt.selected && alt.isCorrect)
            ? QuizResponse.CORRECT
            : QuizResponse.INCORRECT;
    }

    private _quizPoints(quiz: IFormElements, all = false): number {
        return quiz.questions.reduce<number>(
            (points, question) =>
                question.alternatives.find((alt) => alt.isCorrect && (alt.selected || all)) && question.points
                    ? points + question.points
                    : points,
            0
        );
    }

    // ########################## Metadatos del experimento ##########################

    public getMetadata(): any {
        const surveys = JSON.parse(this._experiment.surveys) as IFormElements[];
        const quizzes = JSON.parse(this._experiment.quizzes) as IFormElements[];

        // Metadatos básico
        const experimentMetadata = {
            id: this._experiment.id,
            user: this._experiment.userName,
            email: this._experiment.userEmail,
            date: this._experiment.creationDate,
        } as any;

        // Datos de los cuestionarios
        surveys.forEach((surv, index) => {
            const baseField = `Survey${index + 1}`;
            let additionalField: string;

            // Respueestas seleccionadas por cada survey
            surv.questions.forEach((question, index2) => {
                additionalField = `AnswerQuestion${index2 + 1}`;
                experimentMetadata[baseField + additionalField] = this._findAnswerQuestionSurvey(question);
            });
        });

        // Datos de las evaluaciones
        quizzes.forEach((quiz, index) => {
            const baseField = `Quiz${index + 1}`;
            let newField: string;

            // Datos de las preguntas del quiz
            quiz.questions.forEach((question, index2) => {
                // Respueestas correctas o incorrectas por cada pregunta
                newField = `${baseField}CorrectQuestion${index2 + 1}`;
                experimentMetadata[newField] = this._isCorrectAnswer(question);

                // Tiempo de respuesta de cada pregunta
                newField = `${baseField}TimeQuestion${index2 + 1}`;
                experimentMetadata[newField] = question.timeResp;
            });

            // Nota de cada quiz
            newField = `Note${baseField}`;
            experimentMetadata[newField] = this._quizPoints(quiz) / this._quizPoints(quiz, true);

            // Tiempo de finalización de cada quiz
            newField = `TimeEnd${baseField}`;
            experimentMetadata[newField] = quiz.section.timeEnd;
        });

        return experimentMetadata;
    }
}
