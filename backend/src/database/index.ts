import mongoose from 'mongoose';

let conn: mongoose.Connection = null;

export const getConnection = async (): Promise<mongoose.Connection> => {
  if (conn === null) {
    const uri: string = process.env.DATABASE;
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false
    }).asPromise();
  }

  return conn;
}
