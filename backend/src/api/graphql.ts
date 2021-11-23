import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import typeDefs from "../graphql/schema";
import resolvers from "../graphql/resolvers";
import { ApolloContext } from '../types/common';
import { Server } from 'http';

export const getApolloServer = (httpServer: Server, context: ApolloContext) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: async (ctx) => {
      return {...context, ctx};
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true
  });
}
