import { gql } from 'apollo-server-express';

/**
 * Family schema
 */
const FamilySchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Family @model{
    id: ID! @isUnique
    father: ID
    mother: ID
    tree: ID!
    fakeMamber: ID
    author: ID! @relation(name: "FamilyOwner")
    access: [Access!]! @relation(name: "AccessFamilys")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  
  input CreateFamilyInput {
    fatherId: ID
    motherId: ID
    fakeMamberId: ID
    treeId: ID!
    authorId: ID!
  }

  input DeleteFamilyInput {
    fakeMamberId:ID
    treeId: ID!
    authorId: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type FamilyPayload {
    id: ID!
    father: User
    mother: User
    fakeMamber: FakeMamber
    tree: Tree!
    author: User!
  }

  type FamilysPayload{
    familys: [FamilyPayload]!
    count: String!
  }
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
      #Gets PhotoAlbum
      getFamilys(authorId: ID!, skip: Int, limit: Int): FamilyPayload
      # Gets all Family
      getFamily(FamilyId: ID!): FamilysPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
     # Creates a new family
    createFamily(input: CreateFamilyInput!): FamilyPayload
    # Deletes a user family
    deleteFamily(input: DeleteFamilyInput!): FamilyPayload
  }
`;

export default FamilySchema;