import mongoose from 'mongoose';
import { IProject } from './project';
import { IUser } from './user';

export interface ITask extends mongoose.Document {
  title: string;
  description: string;
  createdOn: Date;
  isFinalized: boolean;
  project: IProject;
  assignedTo: IUser;
}

export const taskCollectionName: string = 'task';

const schema: mongoose.SchemaDefinition = {
  title: { type: mongoose.SchemaTypes.String, required: true },
  description: { type: mongoose.SchemaTypes.String, required: true },
  createdOn: { type: mongoose.SchemaTypes.Date, required: true },
  isFinalized: { type: mongoose.SchemaTypes.Boolean, required: true },
  project: { type: mongoose.SchemaTypes.ObjectId, required: true },
  assignedTo: { type: mongoose.SchemaTypes.ObjectId, required: true }
}

const taskSchema: mongoose.Schema = new mongoose.Schema(schema);

const Task = (conn: mongoose.Connection): mongoose.Model<ITask> => conn.model(taskCollectionName, taskSchema);

export default Task;
