const md5 = require('md5');

module.exports = ({ meta, config, managers, cache }) => {
    return async ({ req, res, next, results: { __device } }) => {
        // Generate a unique device ID using md5 hash
        const deviceId = md5(__device);
        // Get the current timestamp
        const currentTimestamp = new Date().getTime();
        // Retrieve the rate limit data from the cache for the device
        const redisResult = await cache.hash.get({ key: deviceId });

        // If no rate limit data exists for the device, initialize it
        if (Object.keys(redisResult).length === 0) {
            await cache.hash.set({ key: deviceId, data: { count: 1, createdAt: currentTimestamp } });
        }

        // If rate limit data exists
        if (redisResult) {
            // Calculate the time difference between now and when the rate limit data was created
            let diff = currentTimestamp - Number(redisResult.createdAt);

            // If the time difference exceeds the rate limit duration, reset the rate limit data
            if (diff > config.dotEnv.RATE_LIMIT_DURATION_IN_MILLISECONDS) {
                await cache.hash.set({ key: deviceId, data: { count: 1, createdAt: currentTimestamp } });
                return next();
            }

            // If the request count exceeds the maximum allowed requests, return a rate limit exceeded response
            if (redisResult.count >= config.dotEnv.RATE_LIMIT_MAX_REQUESTS) {
                return managers.responseDispatcher.dispatch(res, {
                    ok: false,
                    code: 429,
                    errors: 'rate limit exceeded',
                });
            } else {
                // Otherwise, increment the request count and update the rate limit data
                await cache.hash.set({
                    key: deviceId,
                    data: { count: Number(redisResult.count) + 1, createdAt: currentTimestamp },
                });
                return next();
            }
        }
    };
};
