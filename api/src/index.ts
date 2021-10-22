import express from 'express';
import { createLogger, format, transports } from 'winston';
const logger = createLogger({
    level: 'debug',
    format: format.cli(),
    defaultMeta: { service: 'api'},
    transports: [
        new transports.Console()
    ]
});
const app = express();
const port = 8080;

app.get('/', (request, response) => {
    response.send('Goodbye World!');
});

app.listen(port, () => {
    logger.debug(`Server started at http://localhost:${port}`);
});
