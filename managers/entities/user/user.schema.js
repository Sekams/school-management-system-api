module.exports = {
    newUser: [
        {
            model: 'username',
            path: 'user.username',
            required: true,
        },
        {
            model: 'email',
            path: 'user.email',
            required: false,
        },
        {
            model: 'password',
            path: 'user.password',
            required: true,
        },
        {
            model: 'name',
            path: 'user.name',
            required: false,
        },
    ],
    findUser: [
        {
            model: 'username',
            path: 'user.username',
            required: true,
        },
    ],
    changeUserRole: [
        {
            model: 'username',
            path: 'user.username',
            required: true,
        },
        {
            model: 'role',
            path: 'role',
            required: true,
        },
    ],
};
