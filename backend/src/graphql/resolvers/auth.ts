import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import { ApolloError } from 'apollo-server-express';
import { ApolloContext, Authorization } from '../../types/common';
import { isDevMode, withTransaction } from '../../utils';
import { inspect } from 'util';
import AuthModel, { IAuth } from '../../database/models/auth';
import UserModel, { IUser } from '../../database/models/user';
import { compare } from '../../utils/crypt';

export default {
  Query: {
    async login(_: void, { username, password }: IAuth, { conn, logger }: ApolloContext): Promise<Authorization> {
      if (isDevMode()) logger.debug('> login');
      const Auth: mongoose.Model<IAuth> = AuthModel(conn);
      const User: mongoose.Model<IUser> = UserModel(conn);
      try {
        const auth = await Auth.findOne({username}).exec();
        if(!auth) return;
        const match = await compare(password, auth.password);
        if (match) {
          const user = await User.findOne({auth: auth._id}).exec();
          const token = jwt.sign({ user: user.toJSON() }, process.env.SECRET, { expiresIn: 1440 });
          return { token };
        }
      } catch (error) {
        logger.error(`> login error: ${inspect(error)}`);
        throw new ApolloError('Error during login');
      }
    }
  },
  Mutation: {
    // TODO: Only here for debugging pourposes, will be deleted at the end of development
    async clearAll (_: void, __: void, { conn, logger }: ApolloContext): Promise<IAuth[]> {
      if (isDevMode()) logger.debug('> clearAll');
      const Auth: mongoose.Model<IAuth> = AuthModel(conn);
      const User: mongoose.Model<IUser> = UserModel(conn);
      try {
        let auths: IAuth[];
        await withTransaction(conn, async()=> {
          await User.deleteMany().exec();
          auths = await Auth.find().exec();
          await Auth.deleteMany().exec();
        });
        return auths;
      } catch (error) {
        logger.error(`> clearAll error: ${inspect(error)}`);
        throw new ApolloError('Error during clearAll');
      }
    },
  }
};
