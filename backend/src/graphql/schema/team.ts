import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getTeams(take: Int!, last: ID): [Team!]
    getTeam(_id: ID!): Team
  }

  extend type Mutation {
    saveTeam(name: String!, description: String!): Team!
    updateTeam(_id: ID!, name: String!, description: String!): Team!
    deleteTeam(_id: ID!): Team
    addTeamUser(_id: ID!, userId: String!): Team!
    removeTeamUser(_id: ID!, userId: String!): Team!
  }

  type Team {
    _id: ID!
    name: String!
    description: String!
    users: [User!]
  }
`;