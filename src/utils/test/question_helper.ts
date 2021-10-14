/* eslint-disable import/prefer-default-export */
import Question from 'src/models/Question';

export const questionsInDb = async () => {
    const questions = await Question.find({});
    return questions;
};
