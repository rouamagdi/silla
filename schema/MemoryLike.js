import { gql } from 'apollo-server-express';

/**
 * Like schema
 */
const MemoryLikeSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type MemoryLike @model{
    id: ID! @isUnique
    memory: ID!
    author: [ID!]! @relation(name: "MemoryLikeOwner")
    access: [Access!]! @relation(name: "AccessMemoryLikes")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateMemoryLikeInput {
    authorId: ID!
    memoryId: ID!
  }

  input DeleteMemoryLikeInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type MemoryLikePayload {
    id: ID!
    memory: MemoryPayload
    author: UserPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    ## Creates a like for memory
    createMemoryLike(input: CreateMemoryLikeInput!): MemoryLike

    # Deletes a memory like
    deleteMemoryLike(input: DeleteMemoryLikeInput!): MemoryLike
  }
`;

export default MemoryLikeSchema;