import mongoose from 'mongoose';

export interface IAuth extends mongoose.Document {
  username: string;
  password: string;
}

export const authCollectionName: string = 'auth';

const schema: mongoose.SchemaDefinition = {
  username: { type: mongoose.SchemaTypes.String, required: true, unique: true },
  password: { type: mongoose.SchemaTypes.String, required: true },
}

const authSchema: mongoose.Schema = new mongoose.Schema(schema);

const Auth = (conn: mongoose.Connection): mongoose.Model<IAuth> => conn.model(authCollectionName, authSchema);

export default Auth;
