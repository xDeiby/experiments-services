/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import ModelType, { IModelType } from '../models/ModelType';
import Experiment, { IExperiment } from '../models/Experiment';
import Section, { ISection } from '../models/Section';
import Question, { IQuestion } from '../models/Question';
import {
    experimentTest,
    modelTest,
    questionsInDb,
    questionQuizTest,
    questionsSurvTest,
    quizTest,
    sectionsInDb,
    surveyTest,
} from '../utils/test/test_helper';

const api = supertest(app);

beforeAll(async () => {
    await ModelType.deleteMany({});
    await Experiment.deleteMany({});
    await Section.deleteMany({});
    await Question.deleteMany({});
});

describe('Tests de integración', () => {
    let modelCreated: IModelType;
    let experimentCreated: IExperiment;
    let surveyCreated: ISection;
    let quizCreated: ISection;
    const questionsSurv: IQuestion[] = [];
    const questionsQuiz: IQuestion[] = [];

    describe('Servicios de un tipo de modelo', () => {
        it('Se agrega un modelo', async () => {
            const response = await api
                .post('/api/model_types')
                .send(modelTest)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            modelCreated = response.body as IModelType;
            expect({ name: modelCreated.name, abbreviation: modelCreated.abbreviation }).toEqual(modelTest);
        });

        // it('Se elimina un modelo', async () => {
        //     const models = await modelsInDb();
        //     await api.delete(`/api/model_types/${models[0]}`).expect(204);

        //     const result = await api.get('/api/model_types').expect(200);

        //     expect(result.body).toHaveLength(initialModels.length - 1);
        // });
        it('Se crea un nuevo modelo, con el mismo nombre', async () => {
            await api
                .post('/api/model_types')
                .send(modelTest)
                .expect(500)
                .expect('Content-Type', /application\/json/);
        });

        it('Se modifica un modelo', async () => {
            const newName = 'Modelo modificado';

            const modify = await api
                .put(`/api/model_types/${modelCreated.id}`)
                .send({ name: newName })
                .expect(200)
                .expect('Content-Type', /application\/json/);

            modelCreated = modify.body as IModelType;

            expect(modelCreated.name).toEqual(newName);
        });

        it('Se verifica la obtención', async () => {
            const models = await api
                .get('/api/model_types')
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(models.body).toContainEqual(modelCreated);

            const model = await api
                .get(`/api/model_types/${modelCreated.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(model.body).toEqual(modelCreated);
        });
    });

    describe('Servicio de experimentos', () => {
        it('Se crea un experimento', async () => {
            const response = await api
                .post('/api/experiments')
                .send({ ...experimentTest, modelType: modelCreated.id })
                .expect(201)
                .expect('Content-Type', /application\/json/);
            experimentCreated = response.body as IExperiment;

            expect({
                title: experimentCreated.title,
                description: experimentCreated.description,
                terms: experimentCreated.terms,
            }).toEqual(experimentTest);
        });

        it('Se modifica el experimento', async () => {
            const newTitle = 'Experimento modificado';
            const response = await api
                .put(`/api/experiments/${experimentCreated.id}`)
                .send({ title: newTitle })
                .expect(200)
                .expect('Content-Type', /application\/json/);

            experimentCreated = response.body as IExperiment;

            expect(experimentCreated.title).toEqual(newTitle);
        });

        it('Se comprueba la obtención de los experimentos', async () => {
            const experiments = await api
                .get('/api/experiments')
                .expect(200)
                .expect('Content-Type', /application\/json/);

            const experiment = await api
                .get(`/api/experiments/${experimentCreated.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(
                experiments.body.map((exp: IExperiment) => ({ ...exp, modelType: (exp.modelType as any).id }))
            ).toContainEqual(experimentCreated);
            expect(experiment.body.id).toEqual(experimentCreated.id);
        });

        it('Se comprueba la creación de un Quiz y un Survey por defecto en el experimento', async () => {
            const numSectionDefaults = 2;
            const sections = await sectionsInDb();

            expect(sections).toHaveLength(numSectionDefaults);
            expect(sections.every((section) => experimentCreated.id === section.experiment.toString())).toBe(true);
        });

        it('Se comprueba la creación de 1 pregunta por defecto, por cada sección creada por defecto', async () => {
            const numQuestions = 2;
            const questions = await questionsInDb();

            expect(questions).toHaveLength(numQuestions);
            expect(questions.every((question) => experimentCreated.id === question.experiment.toString())).toBe(true);
        });
    });

    describe('Servicio de secciones', () => {
        it('Se crea un Survey en el experimento', async () => {
            const response = await api
                .post('/api/sections')
                .send({ ...surveyTest, experiment: experimentCreated.id })
                .expect(201)
                .expect('Content-Type', /application\/json/);
            surveyCreated = response.body as ISection;

            expect({
                title: surveyCreated.title,
                description: surveyCreated.description,
                type: surveyCreated.type,
            }).toEqual(surveyTest);
        });
        it('Se crea un Quiz en el experimento', async () => {
            const response = await api
                .post('/api/sections')
                .send({ ...quizTest, experiment: experimentCreated.id })
                .expect(201)
                .expect('Content-Type', /application\/json/);
            quizCreated = response.body as ISection;

            expect({
                title: quizCreated.title,
                description: quizCreated.description,
                quizTime: quizCreated.quizTime,
                type: quizCreated.type,
            }).toEqual(quizTest);
        });

        it('Se verifican todas las secciones creadas', async () => {
            const response = await api
                .get('/api/sections')
                .expect(200)
                .expect('Content-Type', /application\/json/);

            const sectionOfExperiment = response.body.filter(
                (section: ISection) => section.experiment.toString() === experimentCreated.id
            );

            expect(response.body).toEqual(sectionOfExperiment);
        });

        it('Se verifican la obtención del Quiz y Survey del experimento', async () => {
            const quizResult = await api
                .get(`/api/sections/${quizCreated.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            const survResult = await api
                .get(`/api/sections/${surveyCreated.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(quizResult.body).toEqual(quizCreated);
            expect(survResult.body).toEqual(surveyCreated);
        });

        it('Se comprueba la creación de 1 pregunta por defecto, por cada sección creada', async () => {
            const questions = await questionsInDb();

            const createdSections = [surveyCreated.id, quizCreated.id];
            expect(questions.filter((question) => createdSections.includes(question.section.toString()))).toHaveLength(
                createdSections.length
            );
        });

        it('Se modifica un Survey y un Quiz', async () => {
            const newTime = 500;
            const newDescription = 'Nueva descripción del Survey';

            const survModified = await api
                .put(`/api/sections/${surveyCreated.id}`)
                .send({ description: newDescription })
                .expect(200)
                .expect('Content-Type', /application\/json/);

            const quizModified = await api
                .put(`/api/sections/${quizCreated.id}`)
                .send({ quizTime: newTime })
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(survModified.body).toEqual({ ...surveyCreated, description: newDescription });
            expect(quizModified.body).toEqual({ ...quizCreated, quizTime: newTime });
            surveyCreated = survModified.body;
            quizCreated = quizModified.body;
        });
    });

    describe('Servicio de Preguntas', () => {
        it('Creación de 3 preguntas de distinto tipo, en un Survey', async () => {
            for (const currentQuestion of questionsSurvTest) {
                // eslint-disable-next-line no-await-in-loop
                const response = await api
                    .post('/api/questions')
                    .send({ ...currentQuestion, section: surveyCreated.id, experiment: experimentCreated.id })
                    .expect(201)
                    .expect('Content-Type', /application\/json/);

                const { question, type, required, alternatives } = response.body as IQuestion;

                expect({
                    question,
                    type,
                    required,
                    alternatives: alternatives.reduce<{ value: string }[]>(
                        (notId, alt) => [...notId, { value: alt.value }],
                        []
                    ),
                }).toEqual(currentQuestion);
                questionsSurv.push(response.body as IQuestion);
            }
        });

        it('Creación de pregunta de pregunta en Quiz', async () => {
            const response = await api
                .post('/api/questions')
                .send({ ...questionQuizTest, section: quizCreated.id, experiment: experimentCreated.id })
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const { question, type, required, alternatives, explanation, points } = response.body as IQuestion;

            expect({
                question,
                explanation,
                points,
                type,
                required,
                alternatives: alternatives.reduce<{ value: string; isCorrect?: boolean }[]>(
                    (notId, alt) => [...notId, { value: alt.value, isCorrect: alt.isCorrect }],
                    []
                ),
            }).toEqual(questionQuizTest);
            questionsQuiz.push(response.body as IQuestion);
        });
        it('Se agregan alternativas al Quiz', async () => {
            const newAlternatives = [
                { value: 'Nueva alternativa 1' },
                { value: 'Nueva alternativa 2' },
                { value: 'Nueva alternativa 3' },
                { value: 'Nueva alternativa 4' },
            ];

            const questionModified = await api
                .put(`/api/questions/${questionsQuiz[0].id}`)
                .send({ alternatives: [...questionsQuiz[0].alternatives, ...newAlternatives] })
                .expect(200)
                .expect('Content-Type', /application\/json/);

            newAlternatives.forEach((alternative) => {
                expect(
                    (questionModified.body as IQuestion).alternatives.reduce<{ value: string }[]>(
                        (notId, alt) => [...notId, { value: alt.value }],
                        []
                    )
                ).toContainEqual(alternative);
            });
            questionsQuiz.forEach((question, index) => {
                if (question.id === questionModified.body.id) questionsQuiz[index] = questionModified.body;
            });
        });

        it('Se verifican cada una de las preguntas ingresadas', async () => {
            const questions = await api
                .get('/api/questions')
                .expect(200)
                .expect('Content-Type', /application\/json/);

            [...questionsSurv, ...questionsQuiz].forEach((question) => expect(questions.body).toContainEqual(question));
        });

        it('Se comprueba la obtención individual de las preguntas', async () => {
            const response = await api
                .get(`/api/questions/${questionsQuiz[0].id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(response.body).toEqual(questionsQuiz[0]);
        });
    });
});

afterAll(() => {
    mongoose.connection.close();
});
