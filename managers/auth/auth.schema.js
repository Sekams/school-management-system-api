module.exports = {
    signup: [
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
    login: [
        {
            model: 'username',
            required: true,
        },
        {
            model: 'password',
            required: true,
        },
    ],
    logout: [
        {
            model: 'token',
            required: true,
        },
    ],
};
