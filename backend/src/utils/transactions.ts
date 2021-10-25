import { Connection } from "mongoose";

export const withTransaction = async (conn: Connection, operation: () => void | Promise<void>) => {
  const session = await conn.startSession();
  session.startTransaction();
  await operation();
  await session.commitTransaction();
  session.endSession();
}