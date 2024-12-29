module.exports = {
    createSchool: [
        {
            model: 'name',
            path: 'school.name',
            required: true,
        },
        {
            model: 'shortDesc',
            path: 'school.description',
            required: true,
        },
        {
            model: 'arrayOfStrings',
            path: 'school.administrators',
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
            path: 'school.id',
            required: true,
        },
        {
            model: 'name',
            path: 'school.name',
            required: false,
        },
        {
            model: 'shortDesc',
            path: 'school.desc',
            required: false,
        },
        {
            model: 'arrayOfStrings',
            path: 'school.administrators',
            required: false,
        },
    ],
};
