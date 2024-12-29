const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const md5 = require('md5');
const ms = require('ms');
const { token } = require('../_common/schema.models');

module.exports = class TokenManager {
    constructor({ config, mongoModels }) {
        this.config = config;
        this.longTokenExpiresIn = '3y'; //TODO: Shorten these expiry times and put them in the .env file
        this.shortTokenExpiresIn = '1y';
        this.mongoModels = mongoModels;

        this.httpExposed = this.userExposed = this.adminExposed = ['v1_createShortToken'];
    }

    /**
     * short token are issue from long token
     * short tokens are issued for 72 hours
     * short tokens are connected to user-agent
     * short token are used on the soft logout
     * short tokens are used for account switch
     * short token represents a device.
     * long token represents a single user.
     *
     * long token contains immutable data and long lived
     * master key must exists on any device to create short tokens
     */

    async _saveToken({ userId, userKey, type, expiresIn, deviceId, sessionId }) {
        let tokenDoc = null;
        try {
            tokenDoc = await this._validateToken({ userId, userKey, type, deviceId, sessionId });
            if (tokenDoc) {
                return tokenDoc;
            }

            const expiresAt = new Date(Date.now() + ms(expiresIn));
            tokenDoc = await this.mongoModels.token.create({
                userId,
                userKey,
                type,
                expiresAt,
                deleted: false,
                deviceId,
                sessionId,
            });
        } catch (err) {
            console.log(err);
        }
        return tokenDoc;
    }

    async _validateToken({ userId, userKey, type, deviceId, sessionId }) {
        const tokenDoc = await this.mongoModels.token.findOne({
            userId,
            userKey,
            type,
            ...(deviceId && sessionId ? { deviceId, sessionId } : {}),
        });

        if (!tokenDoc || tokenDoc.deleted || tokenDoc.expiresAt < new Date()) {
            return null;
        }

        return tokenDoc;
    }

    async deleteToken({ userId, userKey, deviceId, sessionId }) {
        const updatedToken = await this.mongoModels.token.findOne({
            userId,
            userKey,
            ...(deviceId && sessionId ? { deviceId, sessionId } : {}),
        });

        updatedToken.deleted = true;

        await updatedToken.save();

        return { updatedToken };
    }

    genLongToken({ userId, userKey }) {
        this._saveToken({ userId, userKey, type: 'long', expiresIn: this.longTokenExpiresIn });
        return jwt.sign(
            {
                userKey,
                userId,
            },
            this.config.dotEnv.LONG_TOKEN_SECRET,
            { expiresIn: this.longTokenExpiresIn },
        );
    }

    genShortToken({ userId, userKey, sessionId, deviceId }) {
        this._saveToken({ userId, userKey, type: 'short', expiresIn: this.shortTokenExpiresIn, deviceId, sessionId });
        return jwt.sign({ userKey, userId, sessionId, deviceId }, this.config.dotEnv.SHORT_TOKEN_SECRET, {
            expiresIn: this.shortTokenExpiresIn,
        });
    }

    _verifyToken({ token, secret }) {
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
        } catch (err) {
            console.log(err);
        }
        return decoded;
    }

    verifyLongToken({ token }) {
        let decoded = this._verifyToken({ token, secret: this.config.dotEnv.LONG_TOKEN_SECRET });

        const isValid = this._validateToken({ userId: decoded.userId, userKey: decoded.userKey, type: 'long' });

        if (!isValid) {
            decoded = null;
        }

        return decoded;
    }
    verifyShortToken({ token }) {
        let decoded = this._verifyToken({ token, secret: this.config.dotEnv.SHORT_TOKEN_SECRET });

        const isValid = this._validateToken({
            userId: decoded.userId,
            userKey: decoded.userKey,
            type: 'short',
            deviceId: decoded.deviceId,
            sessionId: decoded.sessionId,
        });

        if (!isValid) {
            decoded = null;
        }

        return decoded;
    }

    /** generate shortId based on a longId */
    v1_createShortToken({ __longToken, __device }) {
        let decoded = __longToken;
        // console.log(decoded);

        let shortToken = this.genShortToken({
            userId: decoded.userId,
            userKey: decoded.userKey,
            sessionId: nanoid(),
            deviceId: md5(__device),
        });

        return { shortToken };
    }
};
