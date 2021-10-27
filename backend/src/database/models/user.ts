import mongoose from 'mongoose';
import { authCollectionName, IAuth } from './auth';

export interface IUser extends mongoose.Document {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  auth: IAuth;
}

export const userCollectionName: string = 'user';

const schema: mongoose.SchemaDefinition = {
  email: { type: mongoose.SchemaTypes.String, required: true, unique: true },
  firstName: { type: mongoose.SchemaTypes.String, required: true },
  lastName: { type: mongoose.SchemaTypes.String, required: true },
  auth: { type: mongoose.SchemaTypes.ObjectId, ref: () => authCollectionName, required: true, unique: true },
}

const userSchema: mongoose.Schema = new mongoose.Schema(schema);
userSchema.virtual('fullName').get(function () { return `${this.firstName} ${this.lastName}` });

const User = (conn: mongoose.Connection): mongoose.Model<IUser> => conn.model(userCollectionName, userSchema);

export default User;
