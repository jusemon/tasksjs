import mongoose from 'mongoose';
import TeamModel, { ITeam } from '../../database/models/team';
import UserModel, { IUser } from '../../database/models/user';
import { ApolloError } from 'apollo-server-express';
import { ApolloContext, PagedArgs } from '../../types/common';
import { getIdOrDefault, isDevMode } from '../../utils';
import { inspect } from 'util';

export default {
  Query: {
    async getTeams(_: void, { take, last }: PagedArgs, { conn, logger }: ApolloContext): Promise<ITeam[]> {
      const lastId = getIdOrDefault(last);
      if (isDevMode()) logger.debug(`> getTeams ${inspect({ take, last, lastId })}`);
      const Team: mongoose.Model<ITeam> = TeamModel(conn);
      try {
        return await Team.find({ _id: { $gt: lastId } }).limit(take).sort({ _id: 1 }).exec();
      } catch (error) {
        logger.error(`> getTeams error: ${inspect(error)}`);
        throw new ApolloError('Error retieving teams');
      }
    },
    async getTeam(_: void, { _id }: ITeam, { conn, logger }: ApolloContext): Promise<ITeam> {
      if (isDevMode()) logger.debug(`> getTeam ${inspect({ _id })}`);
      UserModel(conn);
      const Team: mongoose.Model<ITeam> = TeamModel(conn);
      try {
        return await Team.findOne({ _id }).populate('users').exec();
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
    },
    async addTeamUser(_: void, { _id, userId }: ITeam & { userId: any }, { conn, logger }: ApolloContext): Promise<ITeam> {
      if (isDevMode()) logger.debug(`> addTeamUser ${inspect({ _id, userId })}`);
      const Team: mongoose.Model<ITeam> = TeamModel(conn);
      UserModel(conn);
      try {
        const team = await Team.findById(_id).exec();
        team.users.push(userId);
        await team.save();
        await team.populate('users');
        if (isDevMode()) logger.debug(`> addTeamUser ${inspect({ teamA: team.toObject() })}`);
        return team;
      } catch (error) {
        logger.error(`> addTeamUser error: ${error}`);
        throw new ApolloError('Error adding user to team');
      }
    },
    async removeTeamUser(_: void, { _id, userId }: ITeam & { userId: any }, { conn, logger }: ApolloContext): Promise<ITeam> {
      if (isDevMode()) logger.debug(`> removeTeamUser ${inspect({ _id, userId })}`);
      const Team: mongoose.Model<ITeam> = TeamModel(conn);
      try {
        const team = await Team.findByIdAndUpdate(_id, { $pull: { 'users': { _id: userId } } }).populate('users').exec();
        return team;
      } catch (error) {
        logger.error(`> removeTeamUser error: ${error}`);
        throw new ApolloError('Error removing user from team');
      }
    },
  }
};
