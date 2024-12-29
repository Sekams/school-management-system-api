module.exports = class ResponseDispatcher {
    constructor() {
        this.key = 'responseDispatcher';
    }
    dispatch(res, args) {
        const { ok, data, code, errors, message, msg } = args;
        let statusCode = code ? code : ok == true ? 200 : 400;
        const response = res.status(statusCode).send({
            ok: ok || false,
            data: data || {},
            errors: errors || [],
            message: msg || message || '',
        });
        response.selfHandleResponse = true;
        return response;
    }
};
