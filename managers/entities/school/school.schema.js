module.exports = {
    createSchool: [
        {
            model: 'name',
            path: 'name',
            required: true,
        },
        {
            model: 'shortDesc',
            path: 'description',
            required: true,
        },
        {
            model: 'arrayOfStrings',
            path: 'administrators',
            required: false,
        },
    ],
    findSchool: [
        {
            model: 'slug',
            path: 'school.slug',
            required: true,
        },
    ],
    updateSchool: [
        {
            model: 'id',
            path: 'id',
            required: true,
        },
        {
            model: 'name',
            path: 'name',
            required: false,
        },
        {
            model: 'shortDesc',
            path: 'desc',
            required: false,
        },
        {
            model: 'arrayOfStrings',
            path: 'administrators',
            required: false,
        },
    ],
};
