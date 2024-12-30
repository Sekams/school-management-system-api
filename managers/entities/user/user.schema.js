module.exports = {
    newUser: [
        {
            model: 'username',
            path: 'username',
            required: true,
        },
        {
            model: 'email',
            path: 'email',
            required: false,
        },
        {
            model: 'password',
            path: 'password',
            required: true,
        },
        {
            model: 'name',
            path: 'name',
            required: false,
        },
    ],
    findUser: [
        {
            model: 'username',
            path: 'username',
            required: true,
        },
    ],
    changeUserRole: [
        {
            model: 'username',
            path: 'username',
            required: true,
        },
        {
            model: 'role',
            path: 'role',
            required: true,
        },
    ],
};
