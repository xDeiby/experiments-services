import { IAnswerObj } from '../models/Answer';
import ModelMetadata from '../utils/metadata/communication-analysis/ModelMetadata';
import { CommunicationModel } from '../utils/metadata/communication-analysis/StructureMetada';
import ExperimentMetadata from '../utils/metadata/experiment/ExperimentMetadata2';
import communicationModelTest from '../utils/test/communicationModelTest.json';
import communicationResults from '../utils/test/communicationResults.json';
import answesTest from '../utils/test/answer-test/experimentTest.json';
import experimentExpectedResults from '../utils/test/answer-test/experimentExpectedResults.json';

// Estructuras utilizadas en el test
interface CommunicationMetadataResult {
    actors: number;
    rels: number;
    allNodes: number;
    eventRels: number;
    complexNodes: number;
    simpleNodes: number;
    inputRels: number;
    outputRels: number;
    maxRelsInput: number;
    maxRelsOutput: number;
    maxRels: number;
    diameter: number;
}

interface ExperimentMetadataResult {
    quizSelecteds: number[];
    surveySelecteds: number[];
    timeQuestions: number[];
    timeEnd: number[];
}

describe('Test Unitarios', () => {
    describe('Metadatos de un modelo de ánalisis comunicacional', () => {
        // Modelos de prueba
        const modelsToTest: CommunicationModel[] = communicationModelTest as CommunicationModel[];

        // Solo se incluyen los resultados predecibles, como número de actores o de relaciones
        const results: CommunicationMetadataResult[] = communicationResults as CommunicationMetadataResult[];

        // Instancia del servicio
        const modelMetadata = new ModelMetadata(modelsToTest);

        it('Número de actores', () => {
            modelMetadata.countActors().forEach((result, index) => {
                expect(result.value).toBe(results[index].actors);
            });
        });
        it('Número de relaciones', () => {
            modelMetadata.countRels().forEach((result, index) => {
                expect(result.value).toBe(results[index].rels);
            });
        });

        it('Número de nodos', () => {
            modelMetadata.countNodes().forEach((result, index) => {
                expect(result.value).toBe(results[index].allNodes);
            });
        });

        it('Número de relaciones entre eventos', () => {
            modelMetadata.countEventRels().forEach((result, index) => {
                expect(result.value).toBe(results[index].eventRels);
            });
        });

        it('Número de Eventos complejos', () => {
            modelMetadata.countComplexNodes().forEach((result, index) => {
                expect(result.value).toBe(results[index].complexNodes);
            });
        });

        it('Número de eventos normales', () => {
            modelMetadata.countSimpleNodes().forEach((result, index) => {
                expect(result.value).toBe(results[index].simpleNodes);
            });
        });

        it('Número de relaciones de entrada', () => {
            modelMetadata.countTypeRels('INPUT').forEach((result, index) => {
                expect(result.value).toBe(results[index].inputRels);
            });
        });

        it('Número de relaciones de salida', () => {
            modelMetadata.countTypeRels('OUTPUT').forEach((result, index) => {
                expect(result.value).toBe(results[index].outputRels);
            });
        });

        it('Número máximo de ralaciones de entrada', () => {
            modelMetadata.maxRelsInput().forEach((result, index) => {
                expect(result.value).toBe(results[index].maxRelsInput);
            });
        });

        it('Número máximo de ralaciones de salida', () => {
            modelMetadata.maxRelsOutput().forEach((result, index) => {
                expect(result.value).toBe(results[index].maxRelsOutput);
            });
        });

        it('Número máximo de ralaciones de entrada y salida', () => {
            modelMetadata.maxRels().forEach((result, index) => {
                expect(result.value).toBe(results[index].maxRelsOutput);
            });
        });

        it('Número de nodos simples o complejos en el cámino mas largo (diametro)', () => {
            modelMetadata.diameter().forEach((result, index) => {
                expect(result.value).toBe(results[index].diameter);
            });
        });
    });

    describe('Metadatos de un experimento', () => {
        const results: ExperimentMetadataResult[] = experimentExpectedResults as ExperimentMetadataResult[];
        const metadataExperiment = new ExperimentMetadata(answesTest as IAnswerObj[]);

        metadataExperiment.getQuizzes().forEach((quizzesExperiment, index) => {
            it('Número de alternativas seleccionadas en cada quiz', () => {
                expect(
                    metadataExperiment.answerQuizOfQuestions(quizzesExperiment).map((data) => Number(data.field))
                ).toEqual(results[index].quizSelecteds);
            });

            it('Tiempo en que se responden las preguntas de los Quizzes', () => {
                expect(metadataExperiment.timeQuizOfQuestions(quizzesExperiment).map((data) => data.field)).toEqual(
                    results[index].timeQuestions
                );
            });

            it('Tiempo en responder los Quizzes completos', () => {
                expect(quizzesExperiment.map((quiz) => quiz.section.timeEnd)).toEqual(results[index].timeEnd);
            });
        });

        metadataExperiment.getSurveys().forEach((survey, index) => {
            it('Número de alternativas seleccionadas en cada survey', () => {
                expect(metadataExperiment.numAnswerSurveyQuestions(survey).map((data) => Number(data.field))).toEqual(
                    results[index].surveySelecteds
                );
            });
        });
    });
});
