module.exports = {
    signup: [
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
    login: [
        {
            model: 'username',
            path: 'username',
            required: true,
        },
        {
            model: 'password',
            path: 'password',
            required: true,
        },
    ],
    logout: [
        {
            model: 'token',
            path: 'token',
            required: true,
        },
    ],
};
