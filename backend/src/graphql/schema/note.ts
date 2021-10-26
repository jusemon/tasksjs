import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    getNotes(take: Int!, last: ID): [Note!]
    getNote(_id: ID!): Note
  }

  extend type Mutation {
    saveNote(title: String!, content: String!): Note!
    updateNote(_id: ID!, title: String!, content: String!): Note!
    deleteNote(_id: ID!): Note
    deleteNotes: [Note!]
  }

  type Note {
    _id: ID!
    title: String!
    content: String!
    date: DateTime!
  }
`;