import mongoose from 'mongoose';
import dayjs from 'dayjs';
import NoteModel, { INote } from '../../database/models/note';
import { ApolloError } from 'apollo-server-express';
import { ApolloContext } from '../../types/common';

export default {
  Query: {
    getAllNotes: async (parent: unknown, args: any, { conn, logger }: ApolloContext): Promise<INote[]> => {
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        return await Note.find().exec();
      } catch (error) {
        logger.error('> getAllNotes error: ', error);
        throw new ApolloError('Error retieving all notes');
      }
    },
    getNote: async (parent: unknown, { _id }: INote, { conn, logger }: ApolloContext): Promise<INote> => {
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        return await Note.findById(_id).exec();
      } catch (error) {
        logger.error('> getNote error: ', error);
        throw new ApolloError(`Error retieving note with id ${_id}`);
      }
    }
  },
  Mutation: {
    saveNote: async (parent: unknown, { title, content }: INote, { conn, logger }: ApolloContext): Promise<INote> => {
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        const note = await Note.create({
          title,
          content,
          date: dayjs().toDate()
        });
        return note;
      } catch (error) {
        logger.error('> saveNote error: ', error);
        throw new ApolloError('Error creating note');
      }
    },
    deleteNote: async (parent: unknown, { _id }: INote, { conn, logger }: ApolloContext): Promise<INote> => {
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        const note = await Note.findByIdAndDelete(_id).exec();
        return note;
      } catch (error) {
        logger.error('> deleteNote error: ', error);
        throw new ApolloError('Error deleting note');
      }
    }
  }
};
