import { gql } from 'apollo-server-express';

/**
 * Comment schema
 */
const InvitationCommentSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type InvitationComment @model{
    id: ID! @isUnique
    comment: String!
    author: ID! @relation(name: "InvitationCommentOwner")
    access: [Access!]! @relation(name: "AccessInvitationComments")
    invitation: ID!
    createdAt: Date
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateInvitationCommentInput {
    comment: String!
    authorId: ID!
    invitationId: ID!
  }

  input DeleteInvitationCommentInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type InvitationCommentPayload {
    id: ID
    comment: String
    author: UserPayload
    invitation: InvitationPayload
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a invitation comment
    createInvitationComment(input: CreateInvitationCommentInput!): InvitationComment

    # Deletes a invitation comment
    deleteInvitationComment(input: DeleteInvitationCommentInput!): InvitationComment
  }
`;

export default InvitationCommentSchema;