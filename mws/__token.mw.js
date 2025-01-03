module.exports = ({ meta, config, managers }) => {
    return async ({ req, res, next }) => {
        const { moduleName, fnName } = req.params;

        if (moduleName === 'auth' && ['login', 'signup'].includes(fnName)) {
            return next();
        }

        if (!req.headers.token) {
            console.log('token required but not found');
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }
        let decoded = null;
        try {
            decoded = await managers.token.verifyShortToken({ token: req.headers.token });
            if (!decoded) {
                console.log('failed to decode-1');
                return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
            }
        } catch (err) {
            console.log('failed to decode-2');
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }

        next(decoded);
    };
};
