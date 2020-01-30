import { gql } from 'apollo-server-express';

/**
 * FakeMamber schema
 */
const FakeMamberSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type FakeMamber @model{
    id: ID! @isUnique
    name:String
    image: File
    imagePublicId: String
    father: User
    mother: User
    author: [User!]! @relation(name: "FakeMamberOwner")
    access: [Access!]! @relation(name: "AccessMembers")
    tree: Tree
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateFakeMamberInput {
    id: ID
    name:String
    image: Upload
    imagePublicId: String
    fatherId:ID
    motherId:ID
    treeId: ID
    authorId: ID!
    createdAt: Date
  }
  input DeleteFakeMamberInput {
    id: ID!
    imagePublicId: String
  }
# ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type FakeMamberPayload {
    id: ID! 
    name:String
    image: Upload
    imagePublicId: String
    father: ID
    mother: ID
    author: ID
    tree: ID
    createdAt: Date
  }

  type FakeMambersPayload {
    fakeMambers: [FakeMamberPayload]!
    count: String!
  }
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets all FakeMambers
    getFakeMamber(authorId: ID!, skip: Int, limit: Int): FakeMambersPayload

    # Gets FakeMamber by id
    getFakeMambers(fakeMamberId: ID!): FakeMamberPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new FakeMamber
    createFakeMamber(input: CreateFakeMamberInput!): FakeMamberPayload

    # Deletes a user FakeMamber
    deleteFakeMamber(input: DeleteFakeMamberInput!): FakeMamberPayload
  }
  # ---------------------------------------------------------
  # Subscriptions
  # ---------------------------------------------------------
`;

export default FakeMamberSchema;
