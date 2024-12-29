module.exports = {
    enrollStudent: [
        {
            model: 'relationId',
            path: 'user',
            required: true,
        },
        {
            model: 'relationId',
            path: 'classroom',
            required: true,
        },
        {
            model: 'arrayOfStrings',
            path: 'courses',
            required: false,
        },
    ],
    updateStudentProfile: [
        {
            model: 'relationId',
            path: 'user',
            required: true,
        },
        {
            model: 'name',
            path: 'name',
            required: false,
        },
        {
            model: 'email',
            path: 'email',
            required: false,
        },
        {
            model: 'arrayOfStrings',
            path: 'courses',
            required: false,
        },
    ],
    transferStudent: [
        {
            model: 'relationId',
            path: 'user',
            required: true,
        },
        {
            model: 'relationId',
            path: 'classroom',
            required: true,
        },
        {
            model: 'relationId',
            path: 'newClassroom',
            required: true,
        },
        {
            model: 'arrayOfStrings',
            path: 'courses',
            required: false,
        },
    ],
};
