import dotenv from 'dotenv';
import express from 'express';
import { getLogger } from './utils';
import http from 'http';
import { getApolloServer } from './api/graphql';
import { getConnection } from './database';

dotenv.config();

(async () => {
  const port = process.env.SERVER_PORT;
  const logger = getLogger();
  const app = express();
  const httpServer = http.createServer(app);
  const server = getApolloServer(httpServer, { conn: await getConnection(), logger })
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve => httpServer.listen({ port }, resolve))
  logger.debug(`Server started at http://localhost:${port}${server.graphqlPath}`);
})();
