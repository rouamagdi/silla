import { gql } from 'apollo-server-express';

/**
 * Like schema
 */
const DonationLikeSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type DonationLike @model{
    id: ID! @isUnique
    donation: ID!
    author: ID! @relation(name: "DonationLikeOwner")
    access: [Access!]! @relation(name: "AccessDonationLikes")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateDonationLikeInput {
    authorId: ID!
    donationId: ID!
  }

  input DeleteDonationLikeInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type DonationLikePayload {
    id: ID!
    donation: ID
    author: ID
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
     # Creates a like for donation
     createDonationLike(input: CreateDonationLikeInput!): DonationLike

    # Deletes a donation like
    deleteDonationLike(input: DeleteDonationLikeInput!): DonationLike
  }
`;

export default DonationLikeSchema;