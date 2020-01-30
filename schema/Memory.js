import { gql } from 'apollo-server-express';

/**
 * Memory schema
 */
const MemorySchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Memory @model{
    id: ID! @isUnique
    author: [ID!]! @relation(name: "MemoryOwner")
    text: String
    image: File
    count: Number
    likes: [MemoryLike]
    comments: [MemoryComment]
    access: [Access!]! @relation(name: "AccessMemorys")
    createdAt: Date
    dateto: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateMemoryInput {
    id: ID
    text: String
    createdAt: Date
    dateto: Date
    authorId: ID!
  }
  
  input DeleteMemoryInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type MemoryPayload {
    id: ID!
    text: String
    image: File
    imagePublicId: String
    author: User!
    likes: [MemoryLikePayload]
    comments: [MemoryCommentPayload]
    # notifications: [MemoryNotificationsPayload]
    createdAt: Date
    dateto: Date
  }
  type MemorysPayload {
    memorys: [MemoryPayload]!
    count: Number!
  }
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query { 
    # Gets all tree memory
    getMemorys(authUserId: ID!, skip: Int, limit: Int): MemorysPayload
    # Gets memory by id
    getMemory(id: ID!): MemoryPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new memory
    createMemory(input: CreateMemoryInput!): MemoryPayload

    # Deletes a user memory
    deleteMemory(input: DeleteMemoryInput!): MemoryPayload
  }
`;

export default MemorySchema;