import mongoose from 'mongoose';
import dayjs from 'dayjs';
import NoteModel, { INote } from '../../database/models/note';
import { ApolloError } from 'apollo-server-express';
import { ApolloContext, PagedArgs } from '../../types/common';
import { isDevMode, getIdOrDefault } from '../../utils';
import { inspect } from 'util';

export default {
  Query: {
    async getNotes(_: void, { take, last }: PagedArgs, { conn, logger }: ApolloContext): Promise<INote[]> {
      const lastId = getIdOrDefault(last);
      if (isDevMode()) logger.debug(`> getNotes ${inspect({take, last, lastId})}`);
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        return await Note.find({_id: { $gt: lastId }}).limit(take).sort('id').exec();
      } catch (error) {
        logger.error(`> getNotes error: ${inspect(error)}`);
        throw new ApolloError('Error retieving notes');
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
    async updateNote(_: void, { _id, title, content }: INote, { conn, logger }: ApolloContext): Promise<INote> {
      if (isDevMode()) logger.debug(`> updateNote ${inspect({ title, content })}`);
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        await Note.findByIdAndUpdate(_id, {
          title,
          content,
          date: dayjs().toDate()
        }).exec();
        return await Note.findById(_id).exec();
      } catch (error) {
        logger.error(`> updateNote error: ${error}`);
        throw new ApolloError('Error updating note');
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
    },
    // For debugging
    async deleteNotes(_: void, __: void, { conn, logger }: ApolloContext): Promise<INote[]> {
      if (isDevMode()) logger.debug(`> DeleteNotes`);
      const Note: mongoose.Model<INote> = NoteModel(conn);
      try {
        const note = await Note.find().exec();
        await Note.deleteMany().exec();
        return note;
      } catch (error) {
        logger.error(`> deleteNotes error: ${error}`);
        throw new ApolloError('Error deleting note');
      }
    }

  }
};
