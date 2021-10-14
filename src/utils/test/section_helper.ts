import Section from 'src/models/Section';

export const initialSections = [
    {
        title: 'Survey',
        description: 'Descripcion del survey',
        type: 0,
    },
    {
        title: 'Quiz',
        description: 'Descripcion del quiz',
        type: 1,
        quizTime: 300,
    },
];

// eslint-disable-next-line import/prefer-default-export
export const sectionsInDb = async () => {
    const sections = await Section.find({});

    return sections;
};
