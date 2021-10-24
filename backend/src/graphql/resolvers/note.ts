import mongoose from 'mongoose';
import dayjs from 'dayjs';
import NoteModel, { INote } from '../../database/models/note';
import { ApolloError } from 'apollo-server-express';
import { ApolloContext } from '../../types/common';
import { isDevMode } from '../../utils';
import { inspect } from 'util';

export default {
  Query: {
    async getAllNotes(_: void, __: void, { conn, logger }: ApolloContext): Promise<INote[]> {
      if (isDevMode()) logger.debug('> getAllNotes');
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        return await Note.find().exec();
      } catch (error) {
        logger.error(`> getAllNotes error: ${inspect(error)}`);
        throw new ApolloError('Error retieving all notes');
      }
    },
    async getNote(_: void, { _id }: INote, { conn, logger }: ApolloContext): Promise<INote> {
      if (isDevMode()) logger.debug(`> getNote ${inspect({ _id })}`);
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        return await Note.findById(_id).exec();
      } catch (error) {
        logger.error(`> getNote error: ${inspect(error)}`);
        throw new ApolloError(`Error retieving note with id ${_id}`);
      }
    }
  },
  Mutation: {
    async saveNote(_: void, { title, content }: INote, { conn, logger }: ApolloContext): Promise<INote> {
      if (isDevMode()) logger.debug(`> saveNote ${inspect({ title, content })}`);
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        const note = await Note.create({
          title,
          content,
          date: dayjs().toDate()
        });
        return note;
      } catch (error) {
        logger.error(`> saveNote error: ${error}`);
        throw new ApolloError('Error creating note');
      }
    },
    async deleteNote(_: void, { _id }: INote, { conn, logger }: ApolloContext): Promise<INote> {
      if (isDevMode()) logger.debug(`> DeleteNote ${inspect({ _id })}`);
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        const note = await Note.findByIdAndDelete(_id).exec();
        return note;
      } catch (error) {
        logger.error(`> deleteNote error: ${error}`);
        throw new ApolloError('Error deleting note');
      }
    }
  }
};
