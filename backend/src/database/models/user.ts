import mongoose from 'mongoose';
import { authCollectionName, IAuth } from './auth';
import { ITeam, teamCollectionName } from './team';

export interface IUser extends mongoose.Document {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  auth: IAuth;
  team: ITeam;
}

export const userCollectionName: string = 'user';

const schema: mongoose.SchemaDefinition = {
  email: { type: mongoose.SchemaTypes.String, required: true, unique: true },
  firstName: { type: mongoose.SchemaTypes.String, required: true },
  lastName: { type: mongoose.SchemaTypes.String, required: true },
  team: { type: mongoose.SchemaTypes.ObjectId, ref: teamCollectionName },
  auth: { type: mongoose.SchemaTypes.ObjectId, ref: authCollectionName, required: true, unique: true },
}

const userSchema: mongoose.Schema = new mongoose.Schema(schema);
userSchema.virtual('fullName').get(function () { return `${this.firstName} ${this.lastName}` });

const User = (conn: mongoose.Connection): mongoose.Model<IUser> => conn.model(userCollectionName, userSchema);

export default User;
