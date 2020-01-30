import { gql } from 'apollo-server-express';

/**
 * Like schema
 */
const InvitationLikeSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type InvitationLike @model{
    id: ID! @isUnique
    invitation: ID!
    author: ID! @relation(name: "InvitationLikeOwner")
    access: [Access!]! @relation(name: "AccessInvitationLikes")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreateInvitationLikeInput {
    authorId: ID!
    invitationId: ID!
  }

  input DeleteInvitationLikeInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type InvitationLikePayload {
    id: ID!
    invitation: InvitationPayload
    author: UserPayload
  }

  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a like for invitation
    createInvitationLike(input: CreateInvitationLikeInput!): InvitationLike

    # Deletes a invitation like
    deleteInvitationLike(input: DeleteInvitationLikeInput!): InvitationLike
  }
`;

export default InvitationLikeSchema;