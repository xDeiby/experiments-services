/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// These basic models are used to initialize other models. For example, when creating a section, it will be created with the 'Question' defined by default in this file.

import { ETypeQuestion } from '@src/models/Question';
// eslint-disable-next-line import/no-cycle
import { ETypeSection } from '@src/models/Section';

// Default Question
const defaultQuestion = (experiment: string, section: string, typeSection: ETypeSection = ETypeSection.SURVEY) => ({
    section,
    experiment,
    question: 'Pregunta 1',
    required: true,
    type: ETypeQuestion.SELECT,
    alternatives: [
        {
            value: 'Opcion 1',
            ...(typeSection === ETypeSection.QUIZ && { isCorrect: true }),
        },
    ],
    ...(typeSection === ETypeSection.QUIZ && { points: 5 }),
});

const defaultSection = (experiment: string, type: ETypeSection = ETypeSection.SURVEY) => ({
    experiment,
    ...(type === ETypeSection.SURVEY
        ? {
              title: 'Sección 1',
              description: 'Descipción de esta sección que verá el experimentador',
              type: ETypeSection.SURVEY,
          }
        : {
              title: 'Título del Quiz',
              description: 'Descipción de la evaluación que verá el experimentador antes de realizarla',
              type: ETypeSection.QUIZ,
              quizTime: 300,
          }),
});

export { defaultQuestion, defaultSection };
