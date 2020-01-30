import { gql } from 'apollo-server-express';

/**
 * Like schema
 */
const PostLikeSchema = gql`
  # ---------------------------------------------------------
  # Model Objects
  # ---------------------------------------------------------
  type PostLike @model{
    id: ID! @isUnique
    post: ID!
    author: ID! @relation(name: "PostLikeOwner")
    access: [Access!]! @relation(name: "AccessPostLikes")
    createdAt: Date
  }
  # ---------------------------------------------------------
  # Input Objects
  # ---------------------------------------------------------
  input CreatePostLikeInput {
    authorId: ID!
    postId: ID!
  }

  input DeletePostLikeInput {
    id: ID!
  }
  # ---------------------------------------------------------
  # Return Payloads
  # ---------------------------------------------------------
  type PostLikePayload {
    id: ID!
    post: PostPayload
    author: UserPayload!
  }
  # ---------------------------------------------------------
  # Mutations
  # ---------------------------------------------------------
  extend type Mutation {
     # Creates a like for post
     createPostLike(input: CreatePostLikeInput!): PostLike

    # Deletes a post like
    deletePostLike(input: DeletePostLikeInput!): PostLike
  }
`;

export default PostLikeSchema;