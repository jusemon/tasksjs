import mongoose from 'mongoose';
import { IUser, userCollectionName } from './user';

export interface ITeam extends mongoose.Document {
  name: string;
  description: string;
  users: IUser[];
}

export const teamCollectionName: string = 'team';

const schema: mongoose.SchemaDefinition = {
  name: { type: mongoose.SchemaTypes.String, required: true },
  description: { type: mongoose.SchemaTypes.String, required: true },
  users: [{ type: mongoose.SchemaTypes.ObjectId, ref: userCollectionName }],
}

const teamSchema: mongoose.Schema = new mongoose.Schema(schema);

const Team = (conn: mongoose.Connection): mongoose.Model<ITeam> => conn.model(teamCollectionName, teamSchema);

export default Team;
