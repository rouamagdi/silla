import { gql } from 'apollo-server-express';

/**
 * MemoryComment schema
 */
const MemoryCommentSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type MemoryComment @model{
    id: ID! @isUnique
    comment: String!
    author: [ID!]! @relation(name: "MemoryCommentOwner")
    memory: ID!
    access: [Access!]! @relation(name: "AccessMembers")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateMemoryCommentInput {
    comment: String!
    authorId: ID!
    memoryId: ID!
  }

  input DeleteMemoryCommentInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type MemoryCommentPayload {
    id: ID
    comment: String
    author: UserPayload!
    memory: MemoryPayload!
    createdAt: String
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a memory comment
    createMemoryComment(input: CreateMemoryCommentInput!): MemoryComment

    # Deletes a memory comment
    deleteMemoryComment(input: DeleteMemoryCommentInput!): MemoryComment
  }
`;

export default MemoryCommentSchema;