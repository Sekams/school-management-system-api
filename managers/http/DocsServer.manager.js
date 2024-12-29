const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

module.exports = class DocsServer {
    constructor({ config }) {
        this.config = config;
    }

    /** server configs */
    run() {
        const file = fs.readFileSync('./swagger.yaml', 'utf8');
        const swaggerDocument = YAML.parse(file);

        app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        // Sample route
        app.get('/api/hello', (req, res) => {
            res.send('Hello World!');
        });

        app.listen(this.config.dotEnv.DOCS_PORT, () => {
            console.log(`Docs Server is running on http://localhost:${this.config.dotEnv.DOCS_PORT}`);
        });
    }
};
