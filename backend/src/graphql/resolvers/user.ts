import mongoose from 'mongoose';
import UserModel, { IUser } from '../../database/models/user';
import AuthModel, { IAuth } from '../../database/models/auth';
import { ApolloError } from 'apollo-server-express';
import { ApolloContext, PagedArgs } from '../../types/common';
import { getIdOrDefault, getLogger, isDevMode, withTransaction } from '../../utils';
import { inspect } from 'util';
import { cipher } from '../../utils/crypt';


export default {
  Query: {
    async getUsers(_: void, { take, last }: PagedArgs, { conn, logger }: ApolloContext): Promise<IUser[]> {
      const lastId = getIdOrDefault(last);
      if (isDevMode()) logger.debug(`> getUsers ${inspect({ take, last, lastId })}`);
      const Auth: mongoose.Model<IAuth> = AuthModel(conn);
      const User: mongoose.Model<IUser> = UserModel(conn);
      try {
        return await User.find({ _id: { $gt: lastId } }).limit(take).sort({ _id: 1 }).populate({ path: 'auth', select: '-password' }).exec();
      } catch (error) {
        logger.error(`> getUsers error: ${inspect(error)}`);
        throw new ApolloError('Error retieving users');
      }
    },
    async getUser(_: void, { _id }: IUser, { conn, logger }: ApolloContext): Promise<IUser> {
      if (isDevMode()) logger.debug(`> getUser ${inspect({ _id })}`);
      const User: mongoose.Model<IUser> = UserModel(conn);
      try {
        return await User.findById(_id).populate({ path: 'auth', select: '-password' }).exec();
      } catch (error) {
        logger.error(`> getUser error: ${inspect(error)}`);
        throw new ApolloError(`Error retieving user with id ${_id}`);
      }
    },
    async me(_: void, __: any, {conn, logger, ctx}: ApolloContext): Promise<IUser> {
      logger.debug(`[context keys  ] - ${Object.keys(ctx.req)}`);
      logger.debug(`[context header] - ${(ctx.req.headers) ? Object.keys(ctx.req.headers) : null}`);
      logger.debug(`[context header authorizaton] - ${(ctx.req.headers && ctx.req.headers.authorization) ? ctx.req.headers.authorization : null}`);
      return null;
    }
  },
  Mutation: {
    async saveUser(_: void, { email, firstName, lastName, username, password }: IUser & IAuth, { conn, logger }: ApolloContext): Promise<IUser> {
      if (isDevMode()) logger.debug(`> saveUser ${inspect({ email, firstName, lastName, username, password })}`);
      const Auth: mongoose.Model<IAuth> = AuthModel(conn);
      const User: mongoose.Model<IUser> = UserModel(conn);
      try {
        let user: IUser;
        await withTransaction(conn, async () => {
          const authId = new mongoose.Types.ObjectId();
          [, user] = await Promise.all([Auth.create({
            _id: authId,
            username,
            password: await cipher(password)
          }), User.create({
            email,
            firstName,
            lastName,
            auth: authId
          })]);
        });
        return await user.populate({ path: 'auth', select: '-password' });
      } catch (error) {
        logger.error(`> saveUser error: ${error}`);
        throw new ApolloError('Error creating user');
      }
    },
    async updateUser(_: void, { _id, email, firstName, lastName, username, password }: IUser & IAuth, { conn, logger }: ApolloContext): Promise<IUser> {
      if (isDevMode()) logger.debug(`> updateUser ${inspect({ _id, email, firstName, lastName, username, password })}`);
      const Auth: mongoose.Model<IAuth> = AuthModel(conn);
      const User: mongoose.Model<IUser> = UserModel(conn);
      try {
        let user: IUser;
        await withTransaction(conn, async () => {
          await User.findByIdAndUpdate(_id, {
            email, firstName, lastName
          }).exec();

          const auth: { [key: string]: string } = {
            username
          };
          if (typeof password !== 'undefined' && password !== null) {
            auth.password = password;
          }

          await Auth.findByIdAndUpdate(_id, auth).exec();
          user = await User.findById(_id).populate({ path: 'auth', select: '-password' }).exec();
        });
        return user;
      } catch (error) {
        logger.error(`> updateUser error: ${error}`);
        throw new ApolloError('Error updating user');
      }
    },
    async deleteUser(_: void, { _id }: IUser, { conn, logger }: ApolloContext): Promise<IUser> {
      if (isDevMode()) logger.debug(`> DeleteUser ${inspect({ _id })}`);
      const Auth: mongoose.Model<IAuth> = AuthModel(conn);
      const User: mongoose.Model<IUser> = UserModel(conn);
      try {
        let user: IUser;
        await withTransaction(conn, async () => {
          user = await User.findByIdAndDelete(_id).exec();
          if (user) {
            const auth = await Auth.findByIdAndDelete(user.auth).exec();
            if (auth) {
              user.auth = auth;
              user.auth.password = '';
            }
          }
        });
        return user;
      } catch (error) {
        logger.error(`> deleteUser error: ${error}`);
        throw new ApolloError('Error deleting user');
      }
    }
  }
};
