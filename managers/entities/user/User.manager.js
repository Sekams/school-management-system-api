const bcrypt = require('bcrypt');
const { query } = require('express');
const { nanoid } = require('nanoid');

module.exports = class User {
    constructor({ utils, cache, config, cortex, managers, validators, mongoModels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongoModels = mongoModels;
        this.managers = managers;
        this.usersCollection = 'User';
        this.adminExposed = [
            'post=newUser',
            'get=findUser',
            'patch=changeUserRole',
            'delete=deleteUser',
            'get=getUsers',
        ];
    }

    transformUser(user) {
        // Redact the password
        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }

    async createUser(userData) {
        const { username, email, password, name, res } = userData;

        let user = await this.mongoModels.user.findOne({ username });

        if (user) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'User already exists',
                code: 409,
            });
        }

        // Creation Logic
        if (!user) {
            const passwordHash = await bcrypt.hash(password, Number(this.config.dotEnv.BCRYPT_SALT_ROUNDS));
            user = await this.mongoModels.user.create({
                username,
                email,
                password: passwordHash,
                name,
                ...(this.config.dotEnv.SUPER_ADMIN_USERNAMES.includes(username) && { role: 'super-admin' }),
            });
        }

        const createdUser = this.transformUser(user);

        const longToken = await this.managers.token.genLongToken({
            userId: createdUser.id,
            userKey: nanoid(32),
        });

        // Response
        return {
            user: createdUser,
            longToken,
        };
    }

    async newUser(userData) {
        // Data validation
        const result = await this.validators.user.newUser(userData);
        if (result) return result;

        return await this.createUser(userData);
    }

    async getUsers({ res }) {
        const users = await this.mongoModels.user.find({});

        if (!users) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'No users found',
                code: 404,
            });
        }

        // Response
        return users.map((user) => this.transformUser(user));
    }

    async getUserByUsername({ username, res }) {
        const user = await this.mongoModels.user.findOne({ username });

        if (!user) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'User not found',
                code: 404,
            });
        }

        return this.transformUser(user);
    }

    async getUserById(id) {
        const user = await this.mongoModels.user.findById({ _id: id });

        return user ? this.transformUser(user) : null;
    }

    async findUser({ __query, res }) {
        const { username } = __query;

        // Data validation
        const result = await this.validators.user.findUser(__query);
        if (result) return result;

        return await this.getUserByUsername({ username, res });
    }

    async changeUserRole(userData) {
        const { username, role, res } = userData;

        // Data validation
        const result = await this.validators.user.changeUserRole(userData);
        if (result) return result;

        // Update Logic
        const user = await this.mongoModels.user.findOne({ username });

        if (!user) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'User not found',
                code: 404,
            });
        }

        user.role = role;

        const updatedUser = await user.save();

        // Response
        return this.transformUser(updatedUser);
    }

    async deleteUser({ username, res }) {
        // Data validation
        const result = await this.validators.user.findUser({ username });
        if (result) return result;

        const deletedUser = await this.mongoModels.user.findOneAndDelete({ username });

        // TODO: Delete all documents associated with the user
        if (!deletedUser) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'User not found',
                code: 404,
            });
        }

        return this.transformUser(deletedUser);
    }
};
