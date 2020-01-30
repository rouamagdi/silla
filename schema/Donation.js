import { gql } from 'apollo-server-express';

/**
 * Donation schema
 */
const DonationSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Donation @model{
    id: ID! @isUnique
    tree: Tree
    group: Group
    author: User! @relation(name: "DonationOwner")
    text: String
    image: File
    count: Number
    mount: Number
    likes: [DonationLike]
    comments: [DonationComment]
    access: [Access!]! @relation(name: "AccessDonations")
    createdAt: Date
    dateTo: String
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateDonationInput {
    text: String
    mount:Number
    count: Number
    dateTo:String
    authorId: ID!
    treeId: ID
    groupId: ID
  }

  input DeleteDonationInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type DonationPayload {
    id: ID!
    text: String
    count: Number
    mount: Number
    author: ID!
    likes: [DonationLikePayload]
    comments: [DonationCommentPayload]
    # notifications: [DonationNotificationsPayload]
    tree: ID
    group: ID
    createdAt: Date
    dateTo: String
  }

  type DonationsPayload {
    donations: [DonationPayload]!
    count: String!
  }
  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
    # Gets all tree donation
    getDonations(authUserId: ID!, skip: Int, limit: Int): DonationsPayload
    # Gets donation by id
    getDonation(id: ID!): DonationPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
     # Creates a new donation
     createDonation(input: CreateDonationInput!): DonationPayload

    # Deletes a user donation
    deleteDonation(input: DeleteDonationInput!): DonationPayload
  }
`;

export default DonationSchema;