import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getProjects(take: Int!, last: ID): [Project!]
    getProject(_id: ID!): Project
  }

  extend type Mutation {
    saveProject(name: String!, description: String!, team: ID!): Project!
    updateProject(_id: ID!, name: String!, description: String!, team: ID!): Project!
    deleteProject(_id: ID!): Project
    addProjectTask(_id: ID!, title: String!, description: String!, assignedTo: ID, isFinalized: Boolean): Project!
    updateProjectTask(_id: ID!, taskId: ID!, title: String!, description: String!, assignedTo: ID, isFinalized: Boolean): Project!
    deleteProjectTask(_id: ID!, taskId: ID!): Project!
  }

  type Project {
    _id: ID!
    name: String!
    description: String!
    team: TeamProject!
    tasks: [Task!]
  }

  type TeamProject {
    _id: ID!
    name: String!
    description: String!
  }

  type Task {
    _id: ID!
    title: String!
    description: String!
    createdOn: DateTime!
    isFinalized: Boolean!
    assignedTo: User
  }
`;