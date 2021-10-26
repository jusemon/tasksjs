import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getUsers(take: Int!, last: ID): [User!]
    getUser(_id: ID!): User
  }

  extend type Mutation {
    saveUser(
      email: String,
      firstName: String!,
      lastName: String!,
      username: String!,
      password: String!
    ): User!
    updateUser(
      _id: ID!,
      email: String,
      firstName: String!,
      lastName: String!,
      username: String!,
      password: String!
    ): User!
    deleteUser(_id: ID!): User
  }

  type User {
    _id: ID!
    email: String!
    firstName: String!
    lastName: String!
    fullName: String!
    auth: Auth
  }
`;