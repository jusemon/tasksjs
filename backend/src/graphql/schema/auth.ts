import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    login(username: String!, password: String!): Authorization!
  }

  extend type Mutation {
    clearAll: [Auth!]
  }

  type Authorization {
    token: String!
  }

  type Auth {
    _id: ID!
    username: String!
    password: String
  }
`;