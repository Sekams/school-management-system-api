const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

module.exports = class UserServer {
    constructor({ config, managers }) {
        this.config = config;
        this.userApi = managers.userApi;
    }

    /** for injecting middlewares */
    use(args) {
        app.use(args);
    }

    /** server configs */
    run() {
        app.use(cors({ origin: '*' }));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use('/static', express.static('public'));

        /** an error handler */
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });

        /** a single middleware to handle all */
        app.all('/api/:moduleName/:fnName', this.userApi.mw);

        /** load docs */
        const file = fs.readFileSync('./swagger.yaml', 'utf8');
        const swaggerDocument = YAML.parse(file);

        app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        let server = http.createServer(app);
        server.listen(this.config.dotEnv.PORT, () => {
            console.log(
                `${this.config.dotEnv.SERVICE_NAME.toUpperCase()} is running on port: ${this.config.dotEnv.PORT}`,
            );
        });
    }
};
