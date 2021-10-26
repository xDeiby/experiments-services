/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { IAnswer, IAnswerObj } from '../../../models/Answer';
import isJson from '../../isJson';
import ModelMetadata from '../communication-analysis/ModelMetadata';
import { CommunicationModel } from '../communication-analysis/StructureMetada';
import { IFormElements } from './metadata.types';

interface IMetaField {
    header: string;
    field: number | string;
}

export default class ExperimentMetadata {
    private _experiments: IAnswer[] | IAnswerObj[];

    public get experiments(): IAnswer[] | IAnswerObj[] {
        return this._experiments;
    }

    // Getters and Setters
    public set experiments(value: IAnswer[] | IAnswerObj[]) {
        this._experiments = value;
    }

    public constructor(experiments: IAnswer[] | IAnswerObj[]) {
        this._experiments = experiments;
    }

    public getSurveys(): IFormElements[][] {
        return this.experiments.map((experiment) => JSON.parse(experiment.surveys) as IFormElements[]);
    }

    public getQuizzes(): IFormElements[][] {
        return this.experiments.map((experiment) => JSON.parse(experiment.quizzes) as IFormElements[]);
    }

    private _points(quiz: IFormElements, all = false): number {
        return quiz.questions.reduce<number>(
            (points, question) =>
                question.alternatives.find((alt) => alt.isCorrect && (alt.selected || all)) && question.points
                    ? points + question.points
                    : points,
            0
        );
    }

    // private _getModels(allExps: IAnswer[]){
    //     const quizzes = allExps.map(exp => JSON.parse(exp.quizzes) as IFormElements[]);

    //     return quizzes.map(quizzesExp => quizzesExp.map((quiz, index) => ({quizId: index, model: JSON.parse(quiz.imageDetails?.modelJson as string)}))).flat();
    // }

    // * Survey Metadata: Number answer for each question
    public numAnswerSurveyQuestions(surveys: IFormElements[]): IMetaField[] {
        return surveys
            .map((form, index) =>
                form.questions.reduce<IMetaField[]>(
                    (result, question, currentIndex: number) => [
                        ...result,
                        {
                            field: question.alternatives.filter((alt) => alt.selected).length,
                            header: `surv${index + 1}Question${currentIndex + 1}`,
                        },
                    ],
                    []
                )
            )
            .flat();
    }

    // * Quiz Metadata: Answer Corrects and wrongs per Question
    public answerQuizOfQuestions(quizzes: IFormElements[]): IMetaField[] {
        return quizzes
            .map((form, index) =>
                form.questions.reduce<IMetaField[]>(
                    (result, question, currentIndex: number) => [
                        ...result,
                        {
                            field: question.alternatives.filter((alt) => alt.selected).length,
                            header: `quiz${index + 1}Question${currentIndex + 1}`,
                        },
                    ],
                    []
                )
            )
            .flat();
    }

    public timeQuizOfQuestions(quizzes: IFormElements[]): IMetaField[] {
        return quizzes
            .map((form, index) =>
                form.questions.reduce<IMetaField[]>(
                    (result, question, currentIndex: number) => [
                        ...result,
                        {
                            field: question.timeResp as number,
                            header: `quiz${index + 1}TimeQuestion${currentIndex + 1}`,
                        },
                    ],
                    []
                )
            )
            .flat();
    }

    public metadata(): any[] {
        let surveys: IFormElements[];
        let quizzes: IFormElements[];

        const metadataExperiments: any[] = [];
        let metaExp: any;
        let models: CommunicationModel[];
        let metadataModel: ModelMetadata;
        this.experiments.forEach((exp) => {
            surveys = JSON.parse(exp.surveys) as IFormElements[];
            quizzes = JSON.parse(exp.quizzes) as IFormElements[];

            metaExp = { id: exp.id, user: exp.userName, email: exp.userEmail, date: exp.creationDate };

            // Numero de alternativas seleccionadas en cada pregunta
            this.numAnswerSurveyQuestions(surveys).forEach(({ header, field }) => {
                metaExp[header] = field;
            });

            // Preguntas correacta e incorrectas respondidas
            this.answerQuizOfQuestions(quizzes).forEach(({ header, field }) => {
                metaExp[header] = field;
            });

            // Tiempos por pregunta de cada quiz
            this.timeQuizOfQuestions(quizzes).forEach(({ header, field }) => {
                metaExp[header] = field;
            });

            // Tiempo de finalización y notas
            quizzes.forEach((quiz, index) => {
                metaExp[`quiz${index + 1}Note`] = this._points(quiz) / this._points(quiz, true);
                metaExp[`quiz${index + 1}TimeEnd`] = quiz.section.timeEnd;
            });

            // Model Metadata
            models = quizzes
                .filter((quiz) => isJson(quiz.imageDetails!.modelJson))
                .map((quiz) => JSON.parse(quiz.imageDetails?.modelJson as string)) as CommunicationModel[];

            metadataModel = new ModelMetadata(models);

            // Número de arcos
            metadataModel.countRels().forEach((rel) => {
                metaExp[rel.header] = rel.value;
            });

            // Numero de arcos entre eventos
            metadataModel.countEventRels().forEach((rel) => {
                metaExp[rel.header] = rel.value;
            });

            // Numero de arcos de entrada
            metadataModel.countTypeRels('INPUT').forEach((rel) => {
                metaExp[rel.header] = rel.value;
            });

            // Numero de arcos de salida
            metadataModel.countTypeRels('OUTPUT').forEach((rel) => {
                metaExp[rel.header] = rel.value;
            });

            // Número de nodos simples y complejos
            metadataModel.countNodes().forEach((node) => {
                metaExp[node.header] = node.value;
            });

            // Numero de actores
            metadataModel.countActors().forEach((actor) => {
                metaExp[actor.header] = actor.value;
            });

            // Número de nodos complejos
            metadataModel.countComplexNodes().forEach((node) => {
                metaExp[node.header] = node.value;
            });

            // Número de nodos simples
            metadataModel.countSimpleNodes().forEach((node) => {
                metaExp[node.header] = node.value;
            });

            // Diametro
            metadataModel.diameter().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Densidad
            metadataModel.densitys().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Coeficientes de conectividad
            metadataModel.coeficients().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Promedio de relaciones entre los nodos
            metadataModel.relAverageNodes().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Promedio de relaciones de entrada entre los nodos
            metadataModel.relInputAverage().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Promedio de relaciones de salida entre los nodos
            metadataModel.relOutputAverage().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Número máximo de ralaciones
            metadataModel.maxRels().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Número máximo de ralaciones de entrada
            metadataModel.maxRelsInput().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Número máximo de ralaciones de salida
            metadataModel.maxRelsOutput().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Area del layout
            metadataModel.area().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Ancho del layout
            metadataModel.weights().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            // Alto del layout
            metadataModel.heights().forEach((diam) => {
                metaExp[diam.header] = diam.value;
            });

            metadataExperiments.push(metaExp);
        });

        return metadataExperiments;
    }
}
