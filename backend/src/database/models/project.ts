import mongoose, { Types } from 'mongoose';
import { ITask, taskSchema } from './task';
import { ITeam, teamCollectionName } from './team';

export interface IProject extends mongoose.Document {
  name: string;
  description: string;
  team: ITeam;
  tasks: Types.DocumentArray<ITask>;
}

export const projectCollectionName: string = 'project';

const schema: mongoose.SchemaDefinition = {
  name: { type: mongoose.SchemaTypes.String, required: true },
  description: { type: mongoose.SchemaTypes.String, required: true },
  team: { type: mongoose.SchemaTypes.ObjectId, ref: () => teamCollectionName, required: true },
  tasks: [taskSchema]
}

const projectSchema: mongoose.Schema = new mongoose.Schema(schema);

const Project = (conn: mongoose.Connection): mongoose.Model<IProject> => conn.model(projectCollectionName, projectSchema);

export default Project;
