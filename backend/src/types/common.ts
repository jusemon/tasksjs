import { Connection } from "mongoose";
import { Logger } from "winston";

export interface ApolloContext {
  conn: Connection;
  logger: Logger;
};

export interface Authorization {
  token: string;
}