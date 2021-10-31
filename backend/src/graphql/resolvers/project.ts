import mongoose, { Types } from 'mongoose';
import TeamModel from '../../database/models/team';
import ProjectModel, { IProject } from '../../database/models/project';
import { ITask } from '../../database/models/task';
import { ApolloError } from 'apollo-server-express';
import { ApolloContext, PagedArgs } from '../../types/common';
import { getIdOrDefault, isDevMode } from '../../utils';
import { inspect } from 'util';
import dayjs from 'dayjs';

export default {
  Query: {
    async getProjects(_: void, { take, last }: PagedArgs, { conn, logger }: ApolloContext): Promise<IProject[]> {
      const lastId = getIdOrDefault(last);
      if (isDevMode()) logger.debug(`> getProjects ${inspect({ take, last, lastId })}`);
      const Project: mongoose.Model<IProject> = ProjectModel(conn);
      TeamModel(conn);
      try {
        return await Project.find({ _id: { $gt: lastId } }).limit(take).populate('team').sort({ _id: 1 }).exec();
      } catch (error) {
        logger.error(`> getProjects error: ${inspect(error)}`);
        throw new ApolloError('Error retieving projects');
      }
    },
    async getProjectsByTeam(_: void, { teamId }: { teamId: any }, { conn, logger }: ApolloContext): Promise<IProject[]> {
      if (isDevMode()) logger.debug(`> getProjectsByTeam ${inspect({ teamId })}`);
      const Project: mongoose.Model<IProject> = ProjectModel(conn);
      TeamModel(conn);
      try {
        return await Project.find({ team: { $eq: teamId} }).populate('team').sort({ _id: 1 }).exec();
      } catch (error) {
        logger.error(`> getProjectsByTeam error: ${inspect(error)}`);
        throw new ApolloError('Error retieving projects by team id');
      }
    },
    async getProject(_: void, { _id }: IProject, { conn, logger }: ApolloContext): Promise<IProject> {
      if (isDevMode()) logger.debug(`> getProject ${inspect({ _id })}`);
      const Project: mongoose.Model<IProject> = ProjectModel(conn);
      TeamModel(conn);
      try {
        return await Project.findOne({ _id }).populate('team').exec();
      } catch (error) {
        logger.error(`> getProject error: ${inspect(error)}`);
        throw new ApolloError(`Error retieving project with id ${_id}`);
      }
    }
  },
  Mutation: {
    async saveProject(_: void, { name, description, team }: IProject, { conn, logger }: ApolloContext): Promise<IProject> {
      if (isDevMode()) logger.debug(`> saveProject ${inspect({ name, description })}`);
      const Project: mongoose.Model<IProject> = ProjectModel(conn);
      TeamModel(conn);
      try {
        const project = await Project.create({
          name,
          description,
          team
        });
        return await project.populate('team');
      } catch (error) {
        logger.error(`> saveProject error: ${error}`);
        throw new ApolloError('Error creating project');
      }
    },
    async updateProject(_: void, { _id, name, description, team }: IProject, { conn, logger }: ApolloContext): Promise<IProject> {
      if (isDevMode()) logger.debug(`> updateProject ${inspect({ name, description })}`);
      const Project: mongoose.Model<IProject> = ProjectModel(conn);
      TeamModel(conn);
      try {
        await Project.findByIdAndUpdate(_id, {
          name,
          description,
          team
        }).exec();
        return await Project.findById(_id).populate('team').exec();
      } catch (error) {
        logger.error(`> updateProject error: ${error}`);
        throw new ApolloError('Error updating project');
      }
    },
    async deleteProject(_: void, { _id }: IProject, { conn, logger }: ApolloContext): Promise<IProject> {
      if (isDevMode()) logger.debug(`> DeleteProject ${inspect({ _id })}`);
      const Project: mongoose.Model<IProject> = ProjectModel(conn);
      TeamModel(conn);
      try {
        const project = await Project.findByIdAndDelete(_id).populate('team').exec();
        return project;
      } catch (error) {
        logger.error(`> deleteProject error: ${error}`);
        throw new ApolloError('Error deleting project');
      }
    },
    async addProjectTask(_: void, { _id, title, description, assignedTo, isFinalized }: ITask, { conn, logger }: ApolloContext): Promise<IProject> {
      if (isDevMode()) logger.debug(`> addProjectTask ${inspect({ _id, title, description, assignedTo, isFinalized })}`);
      const Project: mongoose.Model<IProject> = ProjectModel(conn);
      TeamModel(conn);
      try {
        const project = await Project.findById(_id).populate('team').exec();
        project.tasks.push({ title, description, assignedTo, isFinalized, createdOn: dayjs().toDate() });
        return await project.save();
      } catch (error) {
        logger.error(`> addProjectTask error: ${error}`);
        throw new ApolloError('Error adding task to project');
      }
    },
    async updateProjectTask(_: void, { _id, taskId, title, description, assignedTo, isFinalized }: ITask & { taskId: any }, { conn, logger }: ApolloContext): Promise<IProject> {
      if (isDevMode()) logger.debug(`> addProjectTask ${inspect({ _id, title, description, assignedTo, isFinalized })}`);
      const Project: mongoose.Model<IProject> = ProjectModel(conn);
      TeamModel(conn);
      try {
        const project = await Project.findById(_id).populate('team').exec();
        const task = project.tasks.id(taskId);
        if (task) {
          task.title = title;
          task.description = description;
          task.assignedTo = assignedTo;
          task.isFinalized = isFinalized;
          await task.save();
        }
        return project;
      } catch (error) {
        logger.error(`> addProjectTask error: ${error}`);
        throw new ApolloError('Error adding task to project');
      }
    },
    async deleteProjectTask(_: void, { _id, taskId }: IProject & { taskId: any }, { conn, logger }: ApolloContext): Promise<IProject> {
      if (isDevMode()) logger.debug(`> removeProjectTask ${inspect({ _id, taskId })}`);
      const Project: mongoose.Model<IProject> = ProjectModel(conn);
      TeamModel(conn);
      try {
        const project = await Project.findByIdAndUpdate(_id, {
          $pull: { 'tasks': { taskId } }
        }).populate('team').exec();
        return project;
      } catch (error) {
        logger.error(`> removeProjectTask error: ${error}`);
        throw new ApolloError('Error removing task from project');
      }
    },
  }
};
