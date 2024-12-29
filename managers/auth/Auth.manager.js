'use strict';
const bcrypt = require('bcrypt');

module.exports = class Auth {
    constructor({ utils, cache, config, cortex, managers, validators, mongoModels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongoModels = mongoModels;
        this.managers = managers;
        this.userExposed = this.adminExposed = ['post=login', 'post=signup', 'post=logout'];
    }

    async signup(userData) {
        // Data validation
        const result = await this.validators.auth.signup(userData);
        if (result) return result;

        // Response
        return await this.managers.user.createUser(userData);
    }

    async login(userData) {
        const { username, password, __longToken, __device, res } = userData;

        // Data validation
        const result = await this.validators.auth.login(userData);
        if (result) return result;

        const user = await this.mongoModels.user.findOne({ username });

        if (user.error) {
            return user;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'Invalid credentials',
                code: 401,
            });
        }

        const loggedInUser = this.managers.user.transformUser(user);

        const shortToken = await this.managers.token.v1_createShortToken({ __longToken, __device });

        // Response
        return {
            user: loggedInUser,
            shortToken,
        };
    }

    async logout({ __headers, res }) {
        const token = __headers.token;

        const decoded = this.managers.token.verifyShortToken({ token });
        if (!decoded) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'Invalid token',
                code: 401,
            });
        }

        await this.managers.token.deleteToken({
            userId: decoded.userId,
            userKey: decoded.userKey,
            deviceId: decoded.deviceId,
            sessionId: decoded.sessionId,
        });
    }
};
