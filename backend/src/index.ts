import dotenv from 'dotenv';
import express from 'express';
import { getLogger } from './logger';

dotenv.config();

const app = express();
const logger = getLogger();

app.get('/', (request, response) => {
  response.send('Testing world!');
});

app.listen(process.env.SERVER_PORT, () => {
  logger.debug(`Server started at http://localhost:${process.env.SERVER_PORT}`);
});
