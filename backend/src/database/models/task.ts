import mongoose, { Types } from 'mongoose';
import { IUser, userCollectionName } from './user';

export interface ITask extends Types.Subdocument {
  title: string;
  description: string;
  createdOn: Date;
  isFinalized: boolean;
  assignedTo: IUser;
}

export const taskCollectionName: string = 'task';

const schema: mongoose.SchemaDefinition = {
  title: { type: mongoose.SchemaTypes.String, required: true },
  description: { type: mongoose.SchemaTypes.String, required: true },
  createdOn: { type: mongoose.SchemaTypes.Date, required: true },
  isFinalized: { type: mongoose.SchemaTypes.Boolean, required: true, default: () => false },
  assignedTo: { type: mongoose.SchemaTypes.ObjectId, ref: () => userCollectionName }
}

export const taskSchema: mongoose.Schema = new mongoose.Schema(schema);
