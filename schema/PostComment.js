import { gql } from 'apollo-server-express';

/**
 * Comment schema
 */
const PostCommentSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type PostComment @model{
    id: ID! @isUnique
    comment: String!
    author: ID! @relation(name: "PostCommentOwner")
    access: [Access!]! @relation(name: "AccessPostComments")
    post: ID!
    createdAt: Date
  }

  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreatePostCommentInput {
    comment: String!
    authorId: ID!
    postId: ID!
  }

  input DeletePostCommentInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type PostCommentPayload {
    id: ID
    comment: String
    author: UserPayload
    post: PostPayload
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
    # Creates a Post comment
    createPostComment(input: CreatePostCommentInput!): PostComment

    # Deletes a Post comment
    deletePostComment(input: DeletePostCommentInput!): PostComment
  }
`;

export default PostCommentSchema;