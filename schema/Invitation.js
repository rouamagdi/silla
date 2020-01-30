import { gql } from 'apollo-server-express';

/**
 * Invitation schema
 */
const InvitationSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type Invitation @model{
    id: ID! @isUnique
    tree: ID
    group: ID
    author: ID! @relation(name: "InvitationOwner")
    text: String
    image: File
    likes: [InvitationLike]
    comments: [InvitationComment]
    access: [Access!]! @relation(name: "AccessInvitations")
    createdAt: Date
    dateTo: String
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateInvitationInput {
    text: String
    image: Upload
    authorId: ID!
    treeId: ID
    groupId: ID
    dateTo: String
  }

  input DeleteInvitationInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type InvitationPayload {
    id: ID!
    text: String
    image: File
    imagePublicId: String
    author: ID!
    likes: [InvitationLikePayload]
    comments: [InvitationCommentPayload]
    tree: ID
    group: ID
    createdAt: Date
    dateTo: String
  }

  type InvitationsPayload {
    invitations: [InvitationPayload]!
    count: String!
  }

  # ---------------------------------------------------------
  # Queries
  # ---------------------------------------------------------
  extend type Query {
   # Gets all tree invitation
   getInvitations(authUserId: ID!, skip: Int, limit: Int): InvitationsPayload
    # Gets invitation by id
    getInvitation(id: ID!): InvitationPayload
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a new invitation
    createInvitation(input: CreateInvitationInput!): InvitationPayload
    # Deletes a user invitation
    deleteInvitation(input: DeleteInvitationInput!): InvitationPayload
  }
`;

export default InvitationSchema;