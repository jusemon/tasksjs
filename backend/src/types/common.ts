import { ExpressContext } from "apollo-server-express";
import { Connection } from "mongoose";
import { Logger } from "winston";

export interface ApolloContext {
  conn: Connection;
  logger: Logger;
  ctx: ExpressContext;
};

export interface Paged<T> {
  page: number;
  itemsPerPage: number;
  items: T[];
  count: number;
}

export interface PagedArgs {
  take: number;
  last: any;
}

export interface Authorization {
  token: string;
}