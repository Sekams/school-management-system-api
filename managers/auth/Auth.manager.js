'use strict';
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const md5 = require('md5');

const { AUTH_VALIDATION_REPLACEMENTS } = require('../_common/constants');

module.exports = class Auth {
    constructor({ utils, cache, config, cortex, managers, validators, mongoModels } = {}) {
        this.utils = utils;
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongoModels = mongoModels;
        this.managers = managers;

        this.userExposed = ['post=login', 'post=signup', 'post=logout'];
    }

    async signup(userData) {
        // Data validation
        const result = await this.validators.auth.signup(userData);
        if (result) {
            return this.managers.responseDispatcher.dispatch(userData.res, {
                message: this.utils.consolidateValidations({
                    arr: result,
                    key: 'message',
                    replacements: AUTH_VALIDATION_REPLACEMENTS,
                }),
                code: 400,
            });
        }

        // Response
        return await this.managers.user.createUser(userData);
    }

    async login(userData) {
        // Data validation
        const result = await this.validators.auth.login(userData);
        if (result) {
            return this.managers.responseDispatcher.dispatch(userData.res, {
                message: this.utils.consolidateValidations({
                    arr: result,
                    key: 'message',
                    replacements: AUTH_VALIDATION_REPLACEMENTS,
                }),
                code: 400,
            });
        }

        const { username, password, __device, res } = userData;
        const user = await this.mongoModels.user.findOne({ username });

        if (!user) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'Invalid credentials',
                code: 401,
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'Invalid credentials',
                code: 401,
            });
        }

        const longToken = await this.managers.token.getValidLongTokenByUserId({ userId: user._id });

        if (!longToken) {
            return this.managers.responseDispatcher.dispatch(res, {
                message: 'Invalid credentials',
                code: 401,
            });
        }

        const loggedInUser = this.managers.user.transformUser(user);

        const shortToken = await this.managers.token.genShortToken({
            userId: longToken.userId,
            userKey: longToken.userKey,
            deviceId: md5(__device),
            sessionId: nanoid(),
        });

        // Response
        return {
            user: loggedInUser,
            shortToken,
        };
    }

    async logout({ __headers, res }) {
        const token = __headers.token;

        const decoded = await this.managers.token.verifyShortToken({ token });
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
