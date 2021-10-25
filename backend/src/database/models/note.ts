import mongoose from 'mongoose';

export interface INote extends mongoose.Document {
  title: string;
  content: string;
  date: Date;
}

export const noteCollectionName: string = 'note';

const schema: mongoose.SchemaDefinition = {
  title: { type: mongoose.SchemaTypes.String, required: true },
  content: { type: mongoose.SchemaTypes.String, required: true },
  date: { type: mongoose.SchemaTypes.Date, required: true },
}

const noteSchema: mongoose.Schema = new mongoose.Schema(schema);

const Note = (conn: mongoose.Connection): mongoose.Model<INote> => conn.model(noteCollectionName, noteSchema);

export default Note;
