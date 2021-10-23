import mongoose from 'mongoose';

const uri: string = process.env.DATABASE;

let conn: mongoose.Connection = null;

export const getConnection = async (): Promise<mongoose.Connection> => {
  if (conn === null) {
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false
    }).asPromise();
  }

  return conn;
}
