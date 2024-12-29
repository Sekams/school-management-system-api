module.exports = {
    createClassroom: [
        {
            model: 'name',
            path: 'classroom.name',
            required: true,
        },
        {
            model: 'number',
            path: 'capacity',
            required: true,
        },
        {
            model: 'relationId',
            path: 'school',
            required: true,
        },
        {
            model: 'arrayOfStrings',
            path: 'classroom.courses',
            required: false,
        },
    ],
    getClassrooms: [
        {
            model: 'relationId',
            path: 'school',
            required: true,
        },
    ],
    findClassroom: [
        {
            model: 'slug',
            path: 'classroom.slug',
            required: true,
        },
        {
            model: 'relationId',
            path: 'school',
            required: true,
        },
    ],
    updateClassroom: [
        {
            model: 'id',
            path: 'classroom.id',
            required: true,
        },
        {
            model: 'relationId',
            path: 'school',
            required: true,
        },
        {
            model: 'name',
            path: 'classroom.name',
            required: false,
        },
        {
            model: 'number',
            path: 'capacity',
            required: false,
        },
        {
            model: 'relationId',
            path: 'newSchool',
            required: false,
        },
        {
            model: 'arrayOfStrings',
            path: 'classroom.courses',
            required: false,
        },
    ],
};
