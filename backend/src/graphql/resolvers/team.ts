import mongoose from 'mongoose';
import TeamModel, { ITeam } from '../../database/models/team';
import { ApolloError } from 'apollo-server-express';
import { ApolloContext } from '../../types/common';
import { isDevMode } from '../../utils';
import { inspect } from 'util';

export default {
  Query: {
    async getAllTeams(_: void, __: void, { conn, logger }: ApolloContext): Promise<ITeam[]> {
      if (isDevMode()) logger.debug('> getAllTeams');
      const Team: mongoose.Model<ITeam> = TeamModel(conn);
      try {
        return await Team.find().exec();
      } catch (error) {
        logger.error(`> getAllTeams error: ${inspect(error)}`);
        throw new ApolloError('Error retieving all teams');
      }
    },
    async getTeam(_: void, { _id }: ITeam, { conn, logger }: ApolloContext): Promise<ITeam> {
      if (isDevMode()) logger.debug(`> getTeam ${inspect({ _id })}`);
      const Team: mongoose.Model<ITeam> = TeamModel(conn);
      try {
        return await Team.findById(_id).exec();
      } catch (error) {
        logger.error(`> getTeam error: ${inspect(error)}`);
        throw new ApolloError(`Error retieving team with id ${_id}`);
      }
    }
  },
  Mutation: {
    async saveTeam(_: void, { name, description }: ITeam, { conn, logger }: ApolloContext): Promise<ITeam> {
      if (isDevMode()) logger.debug(`> saveTeam ${inspect({ name, description })}`);
      const Team: mongoose.Model<ITeam> = TeamModel(conn);
      try {
        const team = await Team.create({
          name,
          description
        });
        return team;
      } catch (error) {
        logger.error(`> saveTeam error: ${error}`);
        throw new ApolloError('Error creating team');
      }
    },
    async updateTeam(_: void, { _id, name, description }: ITeam, { conn, logger }: ApolloContext): Promise<ITeam> {
      if (isDevMode()) logger.debug(`> updateTeam ${inspect({ name, description })}`);
      const Team: mongoose.Model<ITeam> = TeamModel(conn);
      try {
        await Team.findByIdAndUpdate(_id, {
          name,
          description
        }).exec();
        return await Team.findById(_id).exec();
      } catch (error) {
        logger.error(`> updateTeam error: ${error}`);
        throw new ApolloError('Error updating team');
      }
    },
    async deleteTeam(_: void, { _id }: ITeam, { conn, logger }: ApolloContext): Promise<ITeam> {
      if (isDevMode()) logger.debug(`> DeleteTeam ${inspect({ _id })}`);
      const Team: mongoose.Model<ITeam> = TeamModel(conn);
      try {
        const team = await Team.findByIdAndDelete(_id).exec();
        return team;
      } catch (error) {
        logger.error(`> deleteTeam error: ${error}`);
        throw new ApolloError('Error deleting team');
      }
    }
  }
};
