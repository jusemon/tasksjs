import { gql } from 'apollo-server-express';

import noteSchema from './note';
import customSchema from './custom';
import authSchema from './auth';
import userSchema from './user';

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, noteSchema, authSchema, userSchema, customSchema];
