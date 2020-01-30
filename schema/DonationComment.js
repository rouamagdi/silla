import { gql } from 'apollo-server-express';

/**
 * Comment schema
 */
const DonationCommentSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type DonationComment @model{
    id: ID! @isUnique
    comment: String!
    author: ID! @relation(name: "DonationCommentOwner")
    access: [Access!]! @relation(name: "AccessDonationComments")
    donation: ID!
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateDonationCommentInput {
    comment: String!
    authorId: ID!
    donationId: ID!
  }

  input DeleteDonationCommentInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type DonationCommentPayload {
    id: ID
    comment: String
    author: ID
    donation: ID
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a donation comment
    createDonationComment(input: CreateDonationCommentInput!): DonationComment

    # Deletes a donation comment
    deleteDonationComment(input: DeleteDonationCommentInput!): DonationComment

  }
`;

export default DonationCommentSchema;