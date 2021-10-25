import mongoose from 'mongoose';
import UserModel, { IUser } from '../../database/models/user';
import AuthModel, { IAuth } from '../../database/models/auth';
import { ApolloError } from 'apollo-server-express';
import { ApolloContext } from '../../types/common';
import { isDevMode, withTransaction } from '../../utils';
import { inspect } from 'util';
import { cipher } from '../../utils/crypt';


export default {
  Query: {
    async getAllUsers(_: void, __: void, { conn, logger }: ApolloContext): Promise<IUser[]> {
      if (isDevMode()) logger.debug('> getAllUsers');
      const Auth: mongoose.Model<IAuth> = AuthModel(conn);
      const User: mongoose.Model<IUser> = UserModel(conn);
      try {
        const users = await User.find().populate('auth').exec();
        users.forEach(u => u.auth.password = '');
        return users;
      } catch (error) {
        logger.error(`> getAllUsers error: ${inspect(error)}`);
        throw new ApolloError('Error retieving all users');
      }
    },
    async getUser(_: void, { _id }: IUser, { conn, logger }: ApolloContext): Promise<IUser> {
      if (isDevMode()) logger.debug(`> getUser ${inspect({ _id })}`);
      const User: mongoose.Model<IUser> = UserModel(conn);
      try {
        const user = await User.findById(_id).populate('auth').exec();
        user.auth.password = '';
        return user;
      } catch (error) {
        logger.error(`> getUser error: ${inspect(error)}`);
        throw new ApolloError(`Error retieving user with id ${_id}`);
      }
    }
  },
  Mutation: {
    async saveUser(_: void, { email, firstName, lastName, username, password }: IUser & IAuth, { conn, logger }: ApolloContext): Promise<IUser> {
      if (isDevMode()) logger.debug(`> saveUser ${inspect({ email, firstName, lastName })}`);
      const Auth: mongoose.Model<IAuth> = AuthModel(conn);
      const User: mongoose.Model<IUser> = UserModel(conn);
      try {
        let user: IUser;
        await withTransaction(conn, async () => {
          const auth = await Auth.create({
            username,
            password: await cipher(password)
          });
          user = await User.create({
            email,
            firstName,
            lastName,
            auth
          });
        });
        user.auth.password = '';
        return user;
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
          if (typeof password !== 'undefined') {
            auth.password = password;
          }

          await Auth.findByIdAndUpdate(_id, auth).exec();
          user = await User.findById(_id).populate('auth').exec();
          user.auth.password = '';
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
            const auth = await Auth.findByIdAndDelete(user.auth._id).exec();
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
