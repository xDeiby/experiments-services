/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAnswer } from '../../models/Answer';
import CommunicationoModelMetadata from './communication-analysis/CommunicationModelMetadata';
import { CommunicationModel } from './communication-analysis/StructureMetada';
import ExperimentMetadata from './experiment/ExperimentMetadata';
import { IFormElements } from './experiment/metadata.types';

export default function calculateMetadata(answers: IAnswer[]): any {
    const allMetadata = [] as any[];

    answers.forEach((answer) => {
        let metadata: any;
        const metaExp = new ExperimentMetadata(answer);

        metadata = metaExp.getMetadata();

        const quizzes = JSON.parse(answer.quizzes) as IFormElements[];

        quizzes.forEach((quiz, index) => {
            const jsonModel = JSON.parse(quiz.imageDetails?.modelJson as string) as CommunicationModel;

            // Dependiendo del modelo de jsonModel, deberia escogerse entre usar CommunicationoModelMetadata u otra clase correspondiente al modelo a analizar
            const modelMetadata = new CommunicationoModelMetadata(jsonModel);

            metadata = { ...metadata, ...modelMetadata.getAllMetadata((index + 1).toString()) };
        });

        allMetadata.push(metadata);
    });

    return allMetadata;
}
